import { Context } from "apollo-server-core";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Activity } from "../entities/activity";
import { ActivityType } from "../entities/activityType";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";

@Resolver(Activity)
export class ActivityResolver {
  @Authorized()
  @Query(() => [Activity])
  async getAllActivities(): Promise<Activity[]> {
    const allActivities = await dataSource.getRepository(Activity).find({
      relations: {
        activityType: true,
      },
    });

    return allActivities;
  }

  @Mutation(() => Activity)
  async createActivity(
    @Arg("title") title: string,
    @Arg("activityDate") activityDate: Date,
    @Arg("carbonQuantity") carbonQuantity: number,
    @Arg("description") description: string,
    @Arg("activityType") activityType: string,
    @Ctx() ctx: Context
  ): Promise<Activity> {
    const userFromCtx = ctx as IUserCtx;

    const activityTypeFromDb = await dataSource
      .getRepository(ActivityType)
      .findOneByOrFail({ name: activityType.trim().toLowerCase() });

    const newActivity = new Activity();
    newActivity.title = title;
    newActivity.activityDate = activityDate;
    newActivity.carbonQuantity = carbonQuantity;
    newActivity.description = description;
    newActivity.activityType = activityTypeFromDb;
    newActivity.user = userFromCtx.user;
    newActivity.createdAt = new Date();

    const activityFromDB = await dataSource.manager.save(Activity, newActivity);

    return activityFromDB;
  }
}
