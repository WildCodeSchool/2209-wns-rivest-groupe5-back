import { Arg, Mutation, Query, Resolver } from "type-graphql";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../entities/user";
import dataSource from "../utils/datasource";
import Email from "../services/email";
import { getFrontendBaseUrl } from "../utils/getBaseUrls";
import hashSha256 from "../utils/hashSha256";
import { USER_ROLES } from "../utils/userRoles";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    const allUsers = await dataSource.getRepository(User).find();

    return allUsers;
  }

  @Query(() => String)
  async getToken(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    try {
      const userFromDB = await dataSource.manager.findOneByOrFail(User, {
        email,
      });

      if (process.env.JWT_SECRET_KEY === undefined) {
        throw new Error();
      }

      if (await argon2.verify(userFromDB.password, password)) {
        const token = jwt.sign(
          {
            userId: userFromDB.userId,
            email: userFromDB.email,
            role: userFromDB.role,
          },
          process.env.JWT_SECRET_KEY
        );
        return token;
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log(err);
      throw new Error("Invalid Auth");
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const requestingUser = await dataSource.manager.findOneByOrFail(User, {
      email,
    });

    const resetToken = requestingUser.createPasswordResetToken;
    const resetPasswordFrontUrl = `${getFrontendBaseUrl()}reset-password/${resetToken}`;

    requestingUser.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    requestingUser.passwordResetToken = hashSha256(resetToken);

    await dataSource.manager.save(requestingUser);

    await new Email(requestingUser, resetPasswordFrontUrl).sendPasswordReset();

    return true;
  }

  @Mutation(() => String)
  async resetPassword(
    @Arg("resetToken") resetToken: string,
    @Arg("password") password: string
  ): Promise<String> {
    const passwordResetToken = hashSha256(resetToken);

    const requestingUser = await dataSource.manager.findOneByOrFail(User, {
      passwordResetToken,
    });

    if (
      requestingUser.passwordResetExpires === undefined ||
      password === undefined ||
      password.trim() === "" ||
      new Date() > requestingUser.passwordResetExpires
    ) {
      throw new Error(
        "Permission denied to reset the user password. Please make a forgot password request again."
      );
    }

    requestingUser.password = await argon2.hash(password);
    requestingUser.passwordResetToken = "";
    requestingUser.passwordResetExpires = new Date(0);

    await dataSource.manager.save(requestingUser);

    if (process.env.JWT_SECRET_KEY === undefined) {
      throw new Error();
    }

    const token = jwt.sign(
      { email: requestingUser.email },
      process.env.JWT_SECRET_KEY
    );

    return token;
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
    newUser.role = USER_ROLES.USER;
    const userFromDB = await dataSource.manager.save(User, newUser);

    await new Email(userFromDB, getFrontendBaseUrl()).sendWelcome();

    return userFromDB;
  }
}
