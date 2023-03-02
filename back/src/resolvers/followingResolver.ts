import { Query, Resolver } from "type-graphql";
import { Following } from "../entities/userIsFollowing";
import dataSource from "../utils/datasource";

@Resolver(Following)
export class FollowingResolver {}
