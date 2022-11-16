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

dotenv.config();

const port = 5050;

async function start(): Promise<void> {
  try {
    await dataSource.initialize();

    const schema = await buildSchema({
      resolvers: [
        UserResolver,
        ActivityResolver,
        ActivityTypeResolver,
        ContributionResolver,
        GoodDealResolver,
      ],
      authChecker: ({ context }) => {
        console.log("context", context);
        if (context.email === undefined) {
          return false;
        } else {
          return true;
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
