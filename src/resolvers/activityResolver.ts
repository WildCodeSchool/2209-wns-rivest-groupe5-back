import { Authorized, Query, Resolver } from "type-graphql";
import { Activity } from "../entities/activity";
import dataSource from "../utils/datasource";

@Resolver(Activity)
export class ActivityResolver {
  @Authorized()
  @Query(() => [Activity])
  async getAllActivities(): Promise<Activity[]> {
    const allActivities = await dataSource.getRepository(Activity).find();

    return allActivities;
  }
}
