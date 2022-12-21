import { Resolver, Query, Mutation, Authorized } from "type-graphql";
import { Activity } from "../entities/activity";
import { ActivityType } from "../entities/activityType";
import { Contribution } from "../entities/contribution";
import { GoodDeal } from "../entities/goodDeal";
import { User } from "../entities/user";
import dataSource from "../utils/datasource";

@Resolver()
export class DeleteAllEntitiesResolver {
  @Mutation(() => String)
  async deleteAllEntities() {
    if (process.env.DB !== "dbtest") {
      throw new Error("This resolver is only allowed in test environments");
    }

    // Delete all entities in the database
    await dataSource.manager.delete(Activity, {});
    await dataSource.manager.delete(ActivityType, {});
    await dataSource.manager.delete(Contribution, {});
    await dataSource.manager.delete(GoodDeal, {});
    await dataSource.manager.delete(User, {});

    // Return a success message
    return "All entities deleted successfully";
  }
}
