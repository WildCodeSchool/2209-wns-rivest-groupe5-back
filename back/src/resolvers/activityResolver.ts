import { ApolloError, Context } from 'apollo-server-core'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { MoreThan } from 'typeorm'
import { Activity } from '../entities/activity'
import { ActivityType } from '../entities/activityType'
import { User } from '../entities/user'
import { IUserCtx } from '../interfaces/general/IUserCtx'
import dataSource from '../utils/datasource'
import { USER_ROLES } from '../utils/userRoles'
import { CreateActivityInput } from './inputs/createActivityInput'
import { UpdateActivityInput } from './inputs/updateActivityInput'
import { Following } from '../entities/userIsFollowing'
import { getDateXDaysAgo } from '../utils/dates/datesUtils'
import { IObj } from '../interfaces/general/IObject'
import { userVisibility } from '../interfaces/entities/UserVisibilityOptions'
import { ActivityPaginatedResult } from '../entities/paginated/activityPaginated'
import { FindOptionsOrderValue } from '../interfaces/general/paginated/findOptionsOrderEnum'
import { IActivity } from '../interfaces/entities/IActivity'

@Resolver(Activity)
export class ActivityResolver {
  @Authorized()
  @Query(() => ActivityPaginatedResult)
  async getAllMyActivities(
    @Ctx() ctx: Context,
    @Arg('page', { nullable: true }) page: number = 1,
    @Arg('pageSize', { nullable: true }) pageSize: number = 10
  ): Promise<ActivityPaginatedResult> {
    const userFromCtx = ctx as IUserCtx

    const offset = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      dataSource.getRepository(Activity).find({
        relations: {
          activityType: true,
          user: true,
        },
        where: {
          user: {
            userId: userFromCtx.user.userId,
          },
        },
        skip: offset,
        take: pageSize,
      }),
      dataSource.getRepository(Activity).count({
        where: {
          user: {
            userId: userFromCtx.user.userId,
          },
        },
      }),
    ])

    data.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    const totalPages = Math.ceil(total / pageSize)

    return {
      data,
      total,
      currentPage: page,
      pageSize,
      totalPages,
    }
  }

  @Authorized()
  @Mutation(() => Activity)
  async createActivity(
    @Ctx() ctx: Context,
    @Arg('data') createActivity: CreateActivityInput
  ): Promise<Activity> {
    const userFromCtx = ctx as IUserCtx

    if (createActivity.carbonQuantity <= 0) {
      throw new ApolloError(
        'La quantité de carbone émise doit être supérieure à 0.'
      )
    }

    const activityTypeFromDb = await dataSource
      .getRepository(ActivityType)
      .findOneByOrFail({
        activityTypeId: createActivity.activityTypeId,
      })

    const newActivity = new Activity()
    newActivity.title = createActivity.title
    newActivity.activityDate = createActivity.activityDate
    newActivity.carbonQuantity = createActivity.carbonQuantity
    newActivity.description = createActivity.description
    newActivity.activityType = activityTypeFromDb
    newActivity.user = userFromCtx.user as User
    newActivity.createdAt = new Date()

    const activityFromDB = await dataSource.manager.save(Activity, newActivity)

    return activityFromDB
  }

  @Authorized()
  @Mutation(() => Activity)
  async updateActivity(
    @Ctx() ctx: Context,
    @Arg('activityId') activityId: number,
    @Arg('data') updateActivity: UpdateActivityInput
  ): Promise<Activity> {
    const userFromCtx = ctx as IUserCtx

    const activityFromDb = await dataSource.manager.find(Activity, {
      where: {
        activityId: activityId,
      },
      relations: {
        user: true,
      },
    })

    if (activityFromDb === undefined || activityFromDb[0] === undefined) {
      throw new Error('Not activity found with this activityId')
    }

    if (
      userFromCtx.user.userId !== activityFromDb[0].user.userId &&
      userFromCtx.user.role !== USER_ROLES.ADMIN
    ) {
      // if user requesting is not the author of the activity to update and is not admin, throw error
      throw new Error(
        'The user trying to update the activity is not the activity creator and is not an admin. This action is forbidden.'
      )
    }

    let newActivityTypeFromDb = activityFromDb[0].activityType
    if (updateActivity.activityTypeId !== undefined) {
      newActivityTypeFromDb = await dataSource
        .getRepository(ActivityType)
        .findOneByOrFail({
          activityTypeId: updateActivity.activityTypeId,
        })
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
    )

    if (updatedActivity.affected === 0) {
      throw new Error('Could not update the Activity.')
    }

    // find again activity to get the updated version
    const activity = await dataSource
      .getRepository(Activity)
      .findOneByOrFail({ activityId })

    return activity
  }

  @Authorized()
  @Mutation(() => String)
  async deleteActivity(
    @Ctx() ctx: Context,
    @Arg('activityId') activityId: number
  ): Promise<string> {
    const userFromCtx = ctx as IUserCtx

    const activityFromDb = await dataSource.manager.find(Activity, {
      where: {
        activityId: activityId,
      },
      relations: {
        user: true,
      },
    })

    if (activityFromDb === undefined || activityFromDb[0] === undefined) {
      throw new Error('Not activity found with this activityId')
    }

    if (userFromCtx.user.userId !== activityFromDb[0].user.userId) {
      // if user requesting is not the author of the activity to delete, throw error
      throw new Error(
        'The user trying to delete the activity is not the activity creator. This action is forbidden.'
      )
    }

    const deletedActivity = await dataSource
      .getRepository(Activity)
      .delete({ activityId: activityId })

    if (deletedActivity.affected === 0) {
      throw new Error('Could not delete the Activity.')
    }

    return 'Activity deleted'
  }

  @Authorized()
  @Query(() => ActivityPaginatedResult)
  async getAllUsersFollowedLastSevenDaysActivities(
    @Ctx() ctx: Context,
    @Arg('page', { nullable: true }) page: number = 1,
    @Arg('pageSize', { nullable: true }) pageSize: number = 10
  ): Promise<ActivityPaginatedResult> {
    const userFromCtx = ctx as IUserCtx

    const followedUsers = await dataSource.getRepository(Following).find({
      where: { user: userFromCtx.user.userId },
      select: {
        userFollowed: true,
      },
    })
    const targetDate = getDateXDaysAgo(7)

    const followedUserIds = followedUsers.map(
      (follow: IObj) => follow.userFollowed
    )

    let allUsersActivities: Activity[] = []

    for await (const userId of followedUserIds) {
      const userLastActivities: Activity[] = await dataSource
        .getRepository(Activity)
        .find({
          relations: {
            activityType: true,
            user: true,
          },
          where: {
            user: {
              userId: userId,
            },
            createdAt: MoreThan(targetDate),
          },
          order: {
            createdAt: 'DESC',
          },
          take: 10, // Obtenez les 10 dernières activités pour chaque utilisateur
        })

      allUsersActivities = allUsersActivities.concat(userLastActivities)
    }

    // Triez toutes les activités par ordre chronologique décroissant
    allUsersActivities.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    // Effectuez la pagination en utilisant les paramètres page et pageSize
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedActivities = allUsersActivities.slice(startIndex, endIndex)

    return {
      data: paginatedActivities,
      currentPage: page,
      pageSize,
      total: allUsersActivities.length,
      totalPages: Math.ceil(allUsersActivities.length / pageSize),
    }
  }

  @Query(() => [Activity])
  async getPublicOrFollowedUserLastFiveActivities(
    @Ctx() ctx: Context,
    @Arg('userId') userId: number
  ): Promise<Activity[]> {
    const targetUser = await dataSource
      .getRepository(User)
      .findOneByOrFail({ userId })

    if (targetUser.visibility === userVisibility.private) {
      const userFromCtx = ctx as IUserCtx

      if (userFromCtx.user) {
        const userIsFollowingTarget = await dataSource
          .getRepository(Following)
          .findOneBy({
            user: userFromCtx.user.userId,
            userFollowed: userId,
          })

        if (!userIsFollowingTarget) {
          // target user is private and not followed by the current user
          throw new Error("Cannot access unfollowed private user's data")
        }
      }
      throw new Error("Cannot access unfollowed private user's data")
    }

    const data = await dataSource.getRepository(Activity).find({
      relations: {
        activityType: true,
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
      where: {
        user: {
          userId: userId,
        },
      },
      select: {
        user: {
          userId: true,
          firstname: true,
          lastname: true,
          email: true,
          avatar: true,
        },
      },
      take: 5,
    })

    return data
  }
}
