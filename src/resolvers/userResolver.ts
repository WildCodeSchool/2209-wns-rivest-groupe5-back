import { Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import dataSource from "../utils/datasource";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    const allUsers = await dataSource.getRepository(User).find();

    return allUsers;
  }
}
