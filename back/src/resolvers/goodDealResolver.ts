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
  registerEnumType,
} from 'type-graphql'
import { GoodDeal } from '../entities/goodDeal'
import { User } from '../entities/user'
import { IUserCtx } from '../interfaces/general/IUserCtx'
import dataSource from '../utils/datasource'
import { CreateGoodDealInput } from './inputs/createGoodDealInput'
import { FindOptionsWhere } from 'typeorm'

export enum FindOptionsOrderValue {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(FindOptionsOrderValue, {
  name: 'FindOptionsOrderValue',
})

@ObjectType()
class GoodDealWithTotal extends GoodDeal {
  @Field()
  total: number
}

@Resolver(GoodDeal)
export class GoodDealResolver {
  @Query(() => [GoodDeal])
  async getAllGoodDeals(
    @Arg('limit', { nullable: true, defaultValue: undefined })
    limit: number = 0,
    @Arg('order', () => FindOptionsOrderValue, {
      nullable: true,
      defaultValue: undefined,
    })
    order: FindOptionsOrderValue = FindOptionsOrderValue.ASC
  ): Promise<GoodDeal[]> {
    const allGoodDeals = await dataSource.getRepository(GoodDeal).find({
      order: {
        goodDealId: order,
      },
      relations: {
        goodDealVotes: {
          user: true,
        },
        user: true,
      },
      take: limit,
    })

    return allGoodDeals
  }

  @Query(() => GoodDealWithTotal)
  async getGoodDeal(
    @Arg('goodDealId') goodDealId: number
  ): Promise< GoodDealWithTotal | undefined > {
    const goodDeal = await dataSource.getRepository(GoodDeal).findOne({
      where: {
        goodDealId: goodDealId,
      },
      relations: ['goodDealVotes.user', 'user'],
    })

    var total = goodDeal?.goodDealVotes.reduce((accumulator, current) => accumulator + current.value, 0) ?? 0

    console.log(goodDeal)

    if (!goodDeal) {
      throw new Error("Good deal not found");
    }
    return { ...goodDeal, total: total };
  }

  @Authorized()
  @Query(() => [GoodDeal])
  async getAllMyGoodDeals(@Ctx() ctx: Context): Promise<GoodDeal[]> {
    const userFromCtx = ctx as IUserCtx

    const allGoodDeals = await dataSource.getRepository(GoodDeal).find({
      relations: {
        goodDealVotes: { user: true },
        user: true,
      },
      where: {
        user: {
          userId: userFromCtx.user.userId,
        },
      },
    })

    return allGoodDeals
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
    newGoodDeal.image = createGoodDeal.image
    newGoodDeal.user = userFromCtx.user as User
    newGoodDeal.createdAt = new Date()

    const goodDealFromDB = await dataSource.manager.save(GoodDeal, newGoodDeal)

    return goodDealFromDB
  }
}
