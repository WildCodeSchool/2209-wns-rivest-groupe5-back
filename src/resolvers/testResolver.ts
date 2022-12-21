import { Resolver, Mutation, Arg } from "type-graphql";
import { Activity } from "../entities/activity";
import { ActivityType } from "../entities/activityType";
import { Contribution } from "../entities/contribution";
import { GoodDeal } from "../entities/goodDeal";
import { User } from "../entities/user";
import dataSource from "../utils/datasource";
import { USER_ROLES } from "../utils/userRoles";

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

    return "All entities deleted successfully";
  }

  @Mutation(() => String)
  async upgradeUserToAdmin(@Arg("email") email: string) {
    if (process.env.DB !== "dbtest") {
      throw new Error("This resolver is only allowed in test environments");
    }

    await dataSource
      .getRepository(User)
      .update({ email }, { role: USER_ROLES.ADMIN });

    return `The user with the email ${email} has been upgraded to ADMIN.`;
  }
}
