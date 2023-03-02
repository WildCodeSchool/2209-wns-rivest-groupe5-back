import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import dataSource from "./utils/datasource";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { ActivityResolver } from "./resolvers/activityResolver";
import { ActivityTypeResolver } from "./resolvers/activityTypeResolver";
import { ContributionResolver } from "./resolvers/contributionResolver";
import { GoodDealResolver } from "./resolvers/goodDealResolver";
import { TokenResolver } from "./resolvers/tokenResolver";
import { IDecodedJWT } from "./interfaces/general/IDecodedJWT";
import { User } from "./entities/user";
import { DeleteAllEntitiesResolver } from "./resolvers/testResolver";
import { GoodDealVoteResolver } from "./resolvers/goodDealVoteResolver";
import { GetStatsResolver } from "./resolvers/getStatsResolver";
import { FollowingResolver } from "./resolvers/followingResolver";

dotenv.config();

const port = 5050;

async function start(): Promise<void> {
    try {
        await dataSource.initialize();

        const schema = await buildSchema({
            resolvers: [
                TokenResolver,
                UserResolver,
                ActivityResolver,
                ActivityTypeResolver,
                ContributionResolver,
                GoodDealResolver,
                GoodDealVoteResolver,
                DeleteAllEntitiesResolver,
                GetStatsResolver,
                FollowingResolver,
            ],
            authChecker: ({ context }, roles) => {
                // roles = roles in @Authorized decorators in resolvers

                if (context.user.email === undefined) {
                    return false;
                } else if (
                    roles.length === 0 ||
                    roles.includes(context.user.role)
                ) {
                    return true;
                } else {
                    return false;
                }
            },
        });
        const server = new ApolloServer({
            schema,
            context: async ({ req }) => {
                if (
                    req.headers.authorization === undefined ||
                    process.env.JWT_SECRET_KEY === undefined
                ) {
                    return {};
                } else {
                    try {
                        const reqJWT = req.headers.authorization;

                        if (reqJWT.length > 0) {
                            const verifiedToken = jwt.verify(
                                reqJWT,
                                process.env.JWT_SECRET_KEY
                            );
                            const userToken = verifiedToken as IDecodedJWT;

                            const user = await dataSource
                                .getRepository(User)
                                .findOneByOrFail({ email: userToken.email });

                            return { user: user };
                        } else {
                            return {};
                        }
                    } catch (err) {
                        console.log(err);
                        return {};
                    }
                }
            },
            persistedQueries: false,
        });

        try {
            const { url }: { url: string } = await server.listen({ port });
            console.log(`🚀  Server ready at ${url}`);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log("Error while launching the server");
        console.log(error);
    }
}

start();
