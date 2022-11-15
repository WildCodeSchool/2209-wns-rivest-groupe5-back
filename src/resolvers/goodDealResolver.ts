import { Query, Resolver } from "type-graphql";
import { GoodDeal } from "../entities/goodDeal";
import dataSource from "../utils/datasource";

@Resolver(GoodDeal)
export class GoodDealResolver {
  @Query(() => [GoodDeal])
  async getAllGoodDeals(): Promise<GoodDeal[]> {
    const allGoodDeals = await dataSource.getRepository(GoodDeal).find();

    return allGoodDeals;
  }
}
