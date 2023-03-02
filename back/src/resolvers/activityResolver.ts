import { ApolloError, Context } from "apollo-server-core";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Activity } from "../entities/activity";
import { ActivityType } from "../entities/activityType";
import { User } from "../entities/user";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";
import { USER_ROLES } from "../utils/userRoles";
import { CreateActivityInput } from "./inputs/createActivityInput";
import { UpdateActivityInput } from "./inputs/updateActivityInput";

@Resolver(Activity)
export class ActivityResolver {
    @Authorized()
    @Query(() => [Activity])
    async getAllMyActivities(@Ctx() ctx: Context): Promise<Activity[]> {
        const userFromCtx = ctx as IUserCtx;

        const allActivities = await dataSource.getRepository(Activity).find({
            relations: {
                activityType: true,
                user: true,
            },
            where: {
                user: {
                    userId: userFromCtx.user.userId,
                },
            },
        });

        return allActivities;
    }

    @Authorized()
    @Mutation(() => Activity)
    async createActivity(
        @Ctx() ctx: Context,
        @Arg("data") createActivity: CreateActivityInput
    ): Promise<Activity> {
        const userFromCtx = ctx as IUserCtx;

        if (createActivity.carbonQuantity <= 0) {
            throw new ApolloError(
                "La quantité de carbone émise doit être supérieure à 0."
            );
        }

        const activityTypeFromDb = await dataSource
            .getRepository(ActivityType)
            .findOneByOrFail({
                activityTypeId: createActivity.activityTypeId,
            });

        const newActivity = new Activity();
        newActivity.title = createActivity.title;
        newActivity.activityDate = createActivity.activityDate;
        newActivity.carbonQuantity = createActivity.carbonQuantity;
        newActivity.description = createActivity.description;
        newActivity.activityType = activityTypeFromDb;
        newActivity.user = userFromCtx.user as User;
        newActivity.createdAt = new Date();

        const activityFromDB = await dataSource.manager.save(
            Activity,
            newActivity
        );

        return activityFromDB;
    }

    @Authorized()
    @Mutation(() => Activity)
    async updateActivity(
        @Ctx() ctx: Context,
        @Arg("activityId") activityId: number,
        @Arg("data") updateActivity: UpdateActivityInput
    ): Promise<Activity> {
        const userFromCtx = ctx as IUserCtx;

        const activityFromDb = await dataSource.manager.find(Activity, {
            where: {
                activityId: activityId,
            },
            relations: {
                user: true,
            },
        });

        if (
            activityFromDb !== undefined &&
            activityFromDb[0] !== undefined &&
            userFromCtx.user.userId !== activityFromDb[0].user.userId &&
            userFromCtx.user.role !== USER_ROLES.ADMIN
        ) {
            // if user requesting is not the author of the activity to update and is not admin, throw error
            throw new Error(
                "The user trying to update the activity is not the activity creator and is not an admin. This action is forbidden."
            );
        }

        let newActivityTypeFromDb = activityFromDb[0].activityType;
        if (updateActivity.activityTypeId !== undefined) {
            newActivityTypeFromDb = await dataSource
                .getRepository(ActivityType)
                .findOneByOrFail({
                    activityTypeId: updateActivity.activityTypeId,
                });
        }

        const updatedActivity = await dataSource.getRepository(Activity).update(
            { activityId: activityId },
            {
                activityType: newActivityTypeFromDb,
                title: updateActivity.title,
                activityDate: updateActivity.activityDate,
                carbonQuantity: updateActivity.carbonQuantity,
                description: updateActivity.description,
            }
        );

        if (updatedActivity.affected === 0) {
            throw new Error("Could not update the Activity.");
        }

        // find again activity to get the updated version
        const activity = await dataSource
            .getRepository(Activity)
            .findOneByOrFail({ activityId });

        return activity;
    }
}
