import { Context } from 'apollo-server-core'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { GoodDeal } from '../entities/goodDeal'
import { GoodDealVote } from '../entities/goodDealVote'
import { User } from '../entities/user'
import { IUserCtx } from '../interfaces/general/IUserCtx'
import dataSource from '../utils/datasource'

@Resolver(GoodDealVote)
export class GoodDealVoteResolver {
  @Authorized()
@Mutation(() => GoodDealVote)
async createGoodDealVote(
  @Ctx() ctx: Context,
  @Arg('value') value: -1 | 1,
  @Arg('goodDealId') goodDealId: number
): Promise<GoodDealVote> {
  const userFromCtx = ctx as IUserCtx;

  const goodDealFromDb = await dataSource
    .getRepository(GoodDeal)
    .findOneByOrFail({
      goodDealId: goodDealId,
    });

  const existingVote = await dataSource.getRepository(GoodDealVote)
      .createQueryBuilder('goodDealVote')
      .innerJoinAndSelect('goodDealVote.user', 'user', 'user.userId = :userId', { userId: userFromCtx.user.userId })
      .innerJoinAndSelect('goodDealVote.goodDeal', 'goodDeal', 'goodDeal.goodDealId = :goodDealId', { goodDealId: goodDealId })
      .getOne();

      console.log(existingVote)

  if ( existingVote ) {
    existingVote.value = value;
    existingVote.createdAt = new Date();
    return await dataSource.manager.save(GoodDealVote, existingVote);
  } else {
    const newGoodDealVote = new GoodDealVote();
    newGoodDealVote.value = value;
    newGoodDealVote.goodDeal = goodDealFromDb;
    newGoodDealVote.user = userFromCtx.user as User;
    newGoodDealVote.createdAt = new Date();

    return await dataSource.manager.save(GoodDealVote, newGoodDealVote);
  }
}


  @Authorized()
  @Query(() => [GoodDealVote])
  async getGoodDealVoteByUser(
    @Ctx() ctx: any,
    @Arg('goodDealId') goodDealId: number
  ): Promise<GoodDealVote[]> {
    const userFromCtx = ctx.user as User;

    const goodDealVotesFromDb = await dataSource.getRepository(GoodDealVote)
      .createQueryBuilder('goodDealVote')
      .innerJoinAndSelect('goodDealVote.user', 'user', 'user.userId = :userId', { userId: userFromCtx.userId })
      .innerJoinAndSelect('goodDealVote.goodDeal', 'goodDeal', 'goodDeal.goodDealId = :goodDealId', { goodDealId: goodDealId })
      .getMany();

    return goodDealVotesFromDb;
  }

}
