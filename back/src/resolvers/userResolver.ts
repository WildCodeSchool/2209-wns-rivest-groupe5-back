import {
    Arg,
    Field,
    Authorized,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Ctx,
} from "type-graphql";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../entities/user";
import dataSource from "../utils/datasource";
import Email from "../services/email";
import { getFrontendBaseUrl } from "../utils/getBaseUrls";
import hashSha256 from "../utils/hashSha256";
import { USER_ROLES } from "../utils/userRoles";

@ObjectType()
class LoginResponse {
    @Field()
    token: string;

    @Field(() => User)
    userFromDB: User;
}

@Resolver(User)
export class UserResolver {
    @Authorized()
    @Query(() => User)
    async getMyUserData(@Ctx() context: any): Promise<User> {
        const myUserData = await dataSource
            .getRepository(User)
            .findOneByOrFail({ email: context.user.email });
        return myUserData;
    }

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
                email: email.toLowerCase().trim(),
            });

            if (process.env.JWT_SECRET_KEY === undefined) {
                throw new Error();
            }

            if (await argon2.verify(userFromDB.password, password.trim())) {
                const token = jwt.sign(
                    {
                        email: userFromDB.email,
                    },
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

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string): Promise<boolean> {
        const requestingUser = await dataSource.manager.findOneByOrFail(User, {
            email: email.toLowerCase().trim(),
        });

        const resetToken = requestingUser.createPasswordResetToken;
        const resetPasswordFrontUrl = `${getFrontendBaseUrl()}reset-password/${resetToken}`;

        requestingUser.passwordResetExpires = new Date(
            Date.now() + 10 * 60 * 1000
        ); // 10 min

        requestingUser.passwordResetToken = hashSha256(resetToken);

        await dataSource.manager.save(requestingUser);

        if (process.env.DB !== "dbtest") {
            await new Email(
                requestingUser,
                resetPasswordFrontUrl
            ).sendPasswordReset();
        }

        return true;
    }

    @Mutation(() => String)
    async resetPassword(
        @Arg("resetToken") resetToken: string,
        @Arg("password") password: string
    ): Promise<String> {
        const passwordResetToken = hashSha256(resetToken.trim());

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

        requestingUser.password = await argon2.hash(password.trim());
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
        newUser.email = email.toLowerCase().trim();
        newUser.firstname = firstname;
        newUser.lastname = lastname;
        newUser.password = await argon2.hash(password.trim());
        newUser.role = USER_ROLES.USER;
        const userFromDB = await dataSource.manager.save(User, newUser);

        if (process.env.DB !== "dbtest") {
            await new Email(userFromDB, getFrontendBaseUrl()).sendWelcome();
        }

        return userFromDB;
    }

    @Authorized()
    @Mutation(() => Boolean)
    async inviteFriend(@Arg("email") email: string): Promise<Boolean> {
        if (email === undefined || email.trim() === "")
            throw new Error("No email provided to invite a friend.");

        const fictiveUser = new User();
        fictiveUser.email = email.trim();

        const registerUrl = `${getFrontendBaseUrl()}/register`;

        if (process.env.DB !== "dbtest") {
            await new Email(fictiveUser, registerUrl).sendInvitation();
        }

        return true;
    }
}
