import { Context } from 'apollo-server-core'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import { GoodDeal } from '../entities/goodDeal'
import { User } from '../entities/user'
import { IUserCtx } from '../interfaces/general/IUserCtx'
import dataSource from '../utils/datasource'
import { CreateGoodDealInput } from './inputs/createGoodDealInput'
import { USER_ROLES } from '../utils/userRoles'
import { GoodDealPaginatedResult } from '../entities/paginated/goodDealPaginated'
import { FindOptionsOrderValue } from '../interfaces/general/paginated/findOptionsOrderEnum'

@ObjectType()
class GoodDealWithTotal extends GoodDeal {
  @Field()
  total: number
}

@Resolver(GoodDeal)
export class GoodDealResolver {
  @Query(() => GoodDealPaginatedResult)
  async getAllGoodDeals(
    @Arg('page', { nullable: true }) page: number = 1,
    @Arg('pageSize', { nullable: true }) pageSize: number = 10,
    @Arg('order', () => FindOptionsOrderValue, {
      nullable: true,
      defaultValue: undefined,
    })
    order: FindOptionsOrderValue = FindOptionsOrderValue.ASC
  ): Promise<GoodDealPaginatedResult> {
    const offset = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      dataSource.getRepository(GoodDeal).find({
        order: {
          goodDealId: order,
        },
        relations: {
          goodDealVotes: {
            user: true,
          },
          user: true,
        },
        skip: offset,
        take: pageSize,
      }),
      dataSource.getRepository(GoodDeal).count(),
    ])

    const totalPages = Math.ceil(total / pageSize)

    return {
      data,
      total,
      currentPage: page,
      pageSize,
      totalPages,
    }
  }

  @Query(() => GoodDealWithTotal)
  async getGoodDeal(
    @Arg('goodDealId') goodDealId: number
  ): Promise<GoodDealWithTotal | undefined> {
    const goodDeal = await dataSource.getRepository(GoodDeal).findOne({
      where: {
        goodDealId: goodDealId,
      },
      relations: ['goodDealVotes.user', 'user'],
    })

    var total =
      goodDeal?.goodDealVotes.reduce(
        (accumulator, current) => accumulator + current.value,
        0
      ) ?? 0

    console.log(goodDeal)

    if (!goodDeal) {
      throw new Error('Good deal not found')
    }
    return { ...goodDeal, total: total }
  }

  @Authorized()
  @Query(() => GoodDealPaginatedResult)
  async getAllMyGoodDeals(
    @Ctx() ctx: Context,
    @Arg('page', { nullable: true }) page: number = 1,
    @Arg('pageSize', { nullable: true }) pageSize: number = 10,
    @Arg('order', () => FindOptionsOrderValue, {
      nullable: true,
      defaultValue: undefined,
    })
    order: FindOptionsOrderValue = FindOptionsOrderValue.ASC
  ): Promise<GoodDealPaginatedResult> {
    const userFromCtx = ctx as IUserCtx

    const offset = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      dataSource.getRepository(GoodDeal).find({
        order: {
          goodDealId: order,
        },
        relations: {
          goodDealVotes: {
            user: true,
          },
          user: true,
        },
        where: {
          user: {
            userId: userFromCtx.user.userId,
          },
        },
        skip: offset,
        take: pageSize,
      }),
      dataSource.getRepository(GoodDeal).count({
        where: {
          user: {
            userId: userFromCtx.user.userId,
          },
        },
      }),
    ])

    const totalPages = Math.ceil(total / pageSize)

    return {
      data,
      total,
      currentPage: page,
      pageSize,
      totalPages,
    }
  }

  @Authorized()
  @Mutation(() => GoodDeal)
  async createGoodDeal(
    @Ctx() ctx: Context,
    @Arg('data') createGoodDeal: CreateGoodDealInput
  ): Promise<GoodDeal> {
    const userFromCtx = ctx as IUserCtx

    const newGoodDeal = new GoodDeal()
    newGoodDeal.goodDealTitle = createGoodDeal.goodDealTitle
    newGoodDeal.goodDealLink = createGoodDeal.goodDealLink
    newGoodDeal.goodDealContent = createGoodDeal.goodDealContent
    newGoodDeal.goodDealDescription = createGoodDeal.goodDealDescription
    newGoodDeal.image = createGoodDeal.image
    newGoodDeal.user = userFromCtx.user as User
    newGoodDeal.createdAt = new Date()

    const goodDealFromDB = await dataSource.manager.save(GoodDeal, newGoodDeal)

    return goodDealFromDB
  }

  @Authorized()
  @Mutation(() => String)
  async deleteGoodDeal(
    @Ctx() ctx: Context,
    @Arg('goodDealId') goodDealId: number
  ): Promise<string> {
    const userFromCtx = ctx as IUserCtx

    const goodDeal = await dataSource.getRepository(GoodDeal).findOneOrFail({
      relations: {
        user: true,
      },
      where: { goodDealId: goodDealId },
    })

    if (userFromCtx.user.role !== USER_ROLES.ADMIN) {
      // admin can remove any goodDeal
      if (goodDeal.user.userId !== userFromCtx.user.userId) {
        // otherwise user must be the author to delete
        throw new Error('You are not authorized to delete this good deal')
      }
    }

    await dataSource.getRepository(GoodDeal).remove(goodDeal)

    return 'Good Deal Deleted Successfully.'
  }
}
