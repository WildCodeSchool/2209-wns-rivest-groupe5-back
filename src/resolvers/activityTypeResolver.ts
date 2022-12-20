import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { ActivityType } from "../entities/activityType";
import dataSource from "../utils/datasource";
import { USER_ROLES } from "../utils/userRoles";

@Resolver(ActivityType)
export class ActivityTypeResolver {
  @Query(() => [ActivityType])
  async getAllActivityTypes(): Promise<ActivityType[]> {
    const allActivityTypes = await dataSource
      .getRepository(ActivityType)
      .find();

    return allActivityTypes;
  }

  @Authorized(USER_ROLES.ADMIN)
  @Mutation(() => ActivityType)
  async createActivityType(@Arg("name") name: string): Promise<ActivityType> {
    const newActivityType = new ActivityType();
    newActivityType.name = name;

    const createdActivityType = await dataSource
      .getRepository(ActivityType)
      .save(newActivityType);

    return createdActivityType;
  }
}
