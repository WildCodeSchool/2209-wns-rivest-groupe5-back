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
      ],
      authChecker: ({ context }, roles) => {
        // roles = roles in @Authorized decorators in resolvers

        if (context.email === undefined) {
          return false;
        } else if (roles.length === 0 || roles.includes(context.role)) {
          return true;
        } else {
          return false;
        }
      },
    });
    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        if (
          req.headers.authorization === undefined ||
          process.env.JWT_SECRET_KEY === undefined
        ) {
          return {};
        } else {
          try {
            const reqJWT = req.headers.authorization;

            if (reqJWT.length > 0) {
              const user = jwt.verify(reqJWT, process.env.JWT_SECRET_KEY);
              console.log(user);
              return user;
            } else {
              return {};
            }
          } catch (err) {
            console.log(err);
            return {};
          }
        }
      },
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
