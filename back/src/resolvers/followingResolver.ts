import { ApolloError, Context } from "apollo-server-core";

import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import { Following } from "../entities/userIsFollowing";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";
import { userVisibility } from "../interfaces/entities/UserVisibilityOptions";

@Resolver(Following)
export class FollowingResolver {
    @Authorized()
    @Mutation(() => Following)
    async toggleFollowUser(
        @Ctx() ctx: Context,
        @Arg("userIdToFollow") userIdToFollow: number
    ): Promise<Following> {
        const userFromCtx = ctx as IUserCtx;

        if (userIdToFollow === userFromCtx.user.userId) {
            throw new ApolloError("You can't follow yourself.");
        }

        const existingFollowing = await dataSource
            .getRepository(Following)
            .findOne({
                where: {
                    user: userFromCtx.user.userId,
                    userFollowed: userIdToFollow,
                },
            });

        if (existingFollowing !== null) {
            await dataSource.getRepository(Following).delete(existingFollowing);
            return existingFollowing;
        }

        const userToFollow = await dataSource
            .getRepository(User)
            .findOneOrFail({
                where: {
                    userId: userIdToFollow,
                },
            });

        if (userToFollow.visibility === userVisibility.private) {
            throw new ApolloError(
                "This user is private. You can't follow this account."
            );
        }

        const newFollowing = await dataSource.getRepository(Following).save({
            user: userFromCtx.user.userId,
            userFollowed: userToFollow.userId,
        });

        return newFollowing;
    }

    @Authorized()
    @Query(() => Boolean)
    async getIsUserIsFollowing(
        @Ctx() ctx: Context,
        @Arg("targetUserId") targetUserId: number
    ): Promise<boolean> {
        const userFromCtx = ctx as IUserCtx;

        const existingFollowing = await dataSource
            .getRepository(Following)
            .findOne({
                where: {
                    user: userFromCtx.user.userId,
                    userFollowed: targetUserId,
                },
            });

        return existingFollowing !== null;
    }
}
