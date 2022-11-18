import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../entities/user";
import dataSource from "../utils/datasource";
import Email from "../services/email";

@ObjectType()
class LoginResponse {
  @Field()
  token: string;

  @Field(() => User)
  userFromDB: User;
}

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  async getUserById(@Arg("userId") userId: number): Promise<User> {
    const getUserdata = await dataSource
      .getRepository(User)
      .findOneByOrFail({ userId });
    return getUserdata;
  }

  @Query(() => LoginResponse)
  async getToken(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    try {
      const userFromDB = await dataSource.manager.findOneByOrFail(User, {
        email,
      });
      if (process.env.JWT_SECRET_KEY === undefined) {
        throw new Error();
      }

      if (await argon2.verify(userFromDB.password, password)) {
        const token = jwt.sign(
          { email: userFromDB.email },
          process.env.JWT_SECRET_KEY
        );
        return { token, userFromDB };
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log(err);
      throw new Error("Invalid Auth");
    }
  }

  @Mutation(() => User)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string
  ): Promise<User> {
    const newUser = new User();
    newUser.email = email;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.password = await argon2.hash(password);
    const userFromDB = await dataSource.manager.save(User, newUser);

    await new Email(userFromDB, "test").sendWelcome();

    return userFromDB;
  }
}
