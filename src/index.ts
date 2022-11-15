import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import dataSource from "./utils/datasource";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { ActivityResolver } from "./resolvers/activityResolver";
import { ActivityTypeResolver } from "./resolvers/activityTypeResolver";
import { ContributionResolver } from "./resolvers/contributionResolver";
import { GoodDealResolver } from "./resolvers/goodDealResolver";

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
    });
    const server = new ApolloServer({ schema });

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
