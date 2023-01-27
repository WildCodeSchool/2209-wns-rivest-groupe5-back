import { Context } from "apollo-server-core";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GoodDeal } from "../entities/goodDeal";
import { User } from "../entities/user";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";
import { CreateGoodDealInput } from "./inputs/createGoodDealInput";

@Resolver(GoodDeal)
export class GoodDealResolver {
  @Query(() => [GoodDeal])
  async getAllGoodDeals(): Promise<GoodDeal[]> {
    const allGoodDeals = await dataSource.getRepository(GoodDeal).find({
      relations: {
        goodDealVotes: {
          user: true,
        },
        user: true,
      },
    });

    return allGoodDeals;
  }

  @Authorized()
  @Query(() => [GoodDeal])
  async getAllMyGoodDeals(@Ctx() ctx: Context): Promise<GoodDeal[]> {
    const userFromCtx = ctx as IUserCtx;

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
    });

    return allGoodDeals;
  }

  @Authorized()
  @Mutation(() => GoodDeal)
  async createGoodDeal(
    @Ctx() ctx: Context,
    @Arg("data") createGoodDeal: CreateGoodDealInput
  ): Promise<GoodDeal> {
    const userFromCtx = ctx as IUserCtx;

    const newGoodDeal = new GoodDeal();
    newGoodDeal.goodDealTitle = createGoodDeal.goodDealTitle;
    newGoodDeal.goodDealLink = createGoodDeal.goodDealLink;
    newGoodDeal.goodDealContent = createGoodDeal.goodDealContent;
    newGoodDeal.image = createGoodDeal.image;
    newGoodDeal.user = userFromCtx.user as User;
    newGoodDeal.createdAt = new Date();

    const goodDealFromDB = await dataSource.manager.save(GoodDeal, newGoodDeal);

    return goodDealFromDB;
  }
}
