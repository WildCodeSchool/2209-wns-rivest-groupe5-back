import { Context } from "apollo-server-core";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GoodDeal } from "../entities/goodDeal";
import { GoodDealVote } from "../entities/gooDealVote";
import { User } from "../entities/user";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";

@Resolver(GoodDealVote)
export class GoodDealVoteResolver {
  @Authorized()
  @Mutation(() => GoodDealVote)
  async createGoodDealVote(
    @Ctx() ctx: Context,
    @Arg("value") value: -1 | 1,
    @Arg("goodDealId") goodDealId: number
  ): Promise<GoodDealVote> {
    const userFromCtx = ctx as IUserCtx;

    const goodDealFromDb = await dataSource
      .getRepository(GoodDeal)
      .findOneByOrFail({
        goodDealId: goodDealId,
      });

    const newGoodDealVote = new GoodDealVote();
    newGoodDealVote.value = value;
    newGoodDealVote.goodDeal = goodDealFromDb;
    newGoodDealVote.user = userFromCtx.user as User;
    newGoodDealVote.createdAt = new Date();

    const goodDealVoteFromDB = await dataSource.manager.save(
      GoodDealVote,
      newGoodDealVote
    );

    return goodDealVoteFromDB;
  }
}
