import { Query, Resolver } from "type-graphql";
import { Contribution } from "../entities/contribution";
import dataSource from "../utils/datasource";

@Resolver(Contribution)
export class ContributionResolver {
  @Query(() => [Contribution])
  async getAllContributions(): Promise<Contribution[]> {
    const allContributions = await dataSource
      .getRepository(Contribution)
      .find();

    return allContributions;
  }
}
