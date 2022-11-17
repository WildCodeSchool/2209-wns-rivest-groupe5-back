import { Query, Resolver } from "type-graphql";
import { ActivityType } from "../entities/activityType";
import dataSource from "../utils/datasource";

@Resolver(ActivityType)
export class ActivityTypeResolver {
  @Query(() => [ActivityType])
  async getAllActivityTypes(): Promise<ActivityType[]> {
    const allActivityTypes = await dataSource
      .getRepository(ActivityType)
      .find();

    return allActivityTypes;
  }
}
