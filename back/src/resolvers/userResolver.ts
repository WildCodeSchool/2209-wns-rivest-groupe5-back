import {
  Arg,
  Field,
  Authorized,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Ctx,
} from 'type-graphql'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { User } from '../entities/user'
import dataSource from '../utils/datasource'
import Email from '../services/email'
import { getFrontendBaseUrl } from '../utils/getBaseUrls'
import hashSha256 from '../utils/hashSha256'
import { USER_ROLES } from '../utils/userRoles'
import { Context } from 'apollo-server-core'
import { IUserCtx } from '../interfaces/general/IUserCtx'
import { userVisibility } from '../interfaces/entities/UserVisibilityOptions'
import { Following } from '../entities/userIsFollowing'
import { IUser } from '../interfaces/entities/IUser'
import { ILike, getRepository, SelectQueryBuilder } from 'typeorm'

@ObjectType()
class LoginResponse {
  @Field()
  token: string

  @Field(() => User)
  userFromDB: User
}

@Resolver(User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  async getMyUserData(@Ctx() ctx: Context): Promise<User> {
    const userFromCtx = ctx as IUserCtx

    const myUserData = await dataSource
      .getRepository(User)
      .findOneByOrFail({ email: userFromCtx.user.email })
    return myUserData
  }

  @Query(() => User)
  async getUserById(
    @Ctx() ctx: Context,
    @Arg('userId') userId: number
  ): Promise<User> {
    const getUserdata: User = await dataSource
      .getRepository(User)
      .findOneByOrFail({ userId })

    if (getUserdata.visibility === userVisibility.private) {
      const userFromCtx = ctx as IUserCtx

      if (userFromCtx.user) {
        const userIsFollowingTarget = await dataSource
          .getRepository(Following)
          .findOneBy({
            user: userFromCtx.user.userId,
            userFollowed: userId,
          })

        if (!userIsFollowingTarget) {
          // target user is private and not followed by the current user
          throw new Error("Cannot access unfollowed private user's data")
        }
      }

      // target user is private
      throw new Error("Cannot access unfollowed private user's data")
    }

    return getUserdata
  }

  @Query(() => LoginResponse)
  async getToken(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<LoginResponse> {
    try {
      const userFromDB = await dataSource.manager.findOneByOrFail(User, {
        email: email.toLowerCase().trim(),
      })

      if (process.env.JWT_SECRET_KEY === undefined) {
        throw new Error()
      }

      if (await argon2.verify(userFromDB.password, password.trim())) {
        const token = jwt.sign(
          {
            email: userFromDB.email,
          },
          process.env.JWT_SECRET_KEY
        )
        return { token, userFromDB }
      } else {
        throw new Error()
      }
    } catch (err) {
      console.log(err)
      throw new Error('Invalid Auth')
    }
  }

  @Authorized()
  @Query(() => [User])
  async searchPublicUsers(
    @Arg('searchString') searchString: string
  ): Promise<User[]> {
    const searchTerms = searchString.split(' ')
    const queryBuilder = dataSource
      .getRepository(User)
      .createQueryBuilder('user')

    let query: SelectQueryBuilder<User> = queryBuilder.where(
      'user.visibility = :visibility',
      { visibility: userVisibility.public }
    )

    // Check if searchString matches email pattern
    const emailRegex = /^\S+@\S+\.\S+$/
    const isEmailPattern = emailRegex.test(searchString)

    // if one term and not an email pattern, search firstname and lastname using LIKE operator
    if (searchTerms.length === 1 && !isEmailPattern) {
      const searchTerm = searchTerms[0]
      query = queryBuilder
        .where('user.firstname ILIKE :term AND user.visibility = :visibility', {
          term: `%${searchTerm}%`,
          visibility: userVisibility.public,
        })
        .orWhere(
          'user.lastname ILIKE :term AND user.visibility = :visibility',
          {
            term: `%${searchTerm}%`,
            visibility: userVisibility.public,
          }
        )
    } else if (searchTerms.length === 1 && isEmailPattern) {
      // if one term and an email pattern, search for exact email matches only
      const searchTerm = searchTerms[0]
      query = queryBuilder.where(
        'user.email = :term AND user.visibility = :visibility',
        {
          term: `${searchTerm}`,
          visibility: userVisibility.public,
        }
      )
    } else {
      // if more than 1 search term and is not an email, we assume the first 2 terms are firstname or lastname, others are ignored
      const [firstName, lastName] = searchTerms
      query = queryBuilder
        .where(
          'user.firstname ILIKE :firstName AND user.lastname ILIKE :lastName AND user.visibility = :visibility',
          {
            firstName: `%${firstName}%`,
            lastName: `%${lastName}%`,
            visibility: userVisibility.public,
          }
        )
        .orWhere(
          'user.lastname ILIKE :firstName AND user.firstname ILIKE :lastName AND user.visibility = :visibility',
          {
            firstName: `%${firstName}%`,
            lastName: `%${lastName}%`,
            visibility: userVisibility.public,
          }
        )
    }

    const users = await query.getMany()
    return users
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const requestingUser = await dataSource.manager.findOneByOrFail(User, {
      email: email.toLowerCase().trim(),
    })

    const resetToken = requestingUser.createPasswordResetToken
    const resetPasswordFrontUrl = `${getFrontendBaseUrl()}reset-password/${resetToken}`

    requestingUser.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    requestingUser.passwordResetToken = hashSha256(resetToken)

    await dataSource.manager.save(requestingUser)

    if (process.env.DB !== 'dbtest') {
      await new Email(requestingUser, resetPasswordFrontUrl).sendPasswordReset()
    }

    return true
  }

  @Mutation(() => String)
  async resetPassword(
    @Arg('resetToken') resetToken: string,
    @Arg('password') password: string
  ): Promise<String> {
    const passwordResetToken = hashSha256(resetToken.trim())

    const requestingUser = await dataSource.manager.findOneByOrFail(User, {
      passwordResetToken,
    })

    if (
      requestingUser.passwordResetExpires === undefined ||
      password === undefined ||
      password.trim() === '' ||
      new Date() > requestingUser.passwordResetExpires
    ) {
      throw new Error(
        'Permission denied to reset the user password. Please make a forgot password request again.'
      )
    }

    requestingUser.password = await argon2.hash(password.trim())
    requestingUser.passwordResetToken = ''
    requestingUser.passwordResetExpires = new Date(0)

    await dataSource.manager.save(requestingUser)

    if (process.env.JWT_SECRET_KEY === undefined) {
      throw new Error()
    }

    const token = jwt.sign(
      { email: requestingUser.email },
      process.env.JWT_SECRET_KEY
    )

    return token
  }

  @Mutation(() => User)
  async createUser(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string,
    @Arg('avatar') avatar?: string
  ): Promise<User> {
    const newUser = new User()
    newUser.email = email.toLowerCase().trim()
    newUser.firstname = firstname
    newUser.lastname = lastname
    newUser.password = await argon2.hash(password.trim())
    newUser.role = USER_ROLES.USER
    if (avatar) {
      newUser.avatar = avatar
    }

    const userFromDB = await dataSource.manager.save(User, newUser)

    if (process.env.DB !== 'dbtest') {
      await new Email(userFromDB, getFrontendBaseUrl()).sendWelcome()
    }

    return userFromDB
  }

  @Authorized()
  @Mutation(() => Boolean)
  async inviteFriend(
    @Ctx() ctx: Context,
    @Arg('email') email: string
  ): Promise<Boolean> {
    const userFromCtx = ctx as IUserCtx

    if (email === undefined || email.trim() === '')
      throw new Error('No email provided to invite a friend.')

    const fictiveUser = new User()
    fictiveUser.email = email.trim()

    const registerUrl = `${getFrontendBaseUrl()}`

    if (process.env.DB !== 'dbtest') {
      await new Email(fictiveUser, registerUrl, undefined, {
        sender: userFromCtx.user,
      }).sendInvitation()
    }

    return true
  }

  @Authorized()
  @Mutation(() => String)
  async toggleUserVisibility(@Ctx() ctx: Context): Promise<string> {
    const userFromCtx = ctx as IUserCtx

    const userRepository = dataSource.getRepository(User)

    const dbUser = await userRepository.findOneByOrFail({
      userId: userFromCtx.user.userId,
    })

    const visibilityNewValue =
      userFromCtx.user.visibility === userVisibility.private
        ? userVisibility.public
        : userVisibility.private

    dbUser.visibility = visibilityNewValue

    await userRepository.save(dbUser)

    return visibilityNewValue.toString()
  }

  @Authorized()
  @Mutation(() => User)
  async updateMyUserInformations(
    @Ctx() ctx: Context,
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string
  ): Promise<User> {
    const userFromCtx = ctx as IUserCtx

    const userRepository = dataSource.getRepository(User)

    const dbUser: IUser = await userRepository.findOneByOrFail({
      userId: userFromCtx.user.userId,
    })

    dbUser.firstname = firstname.trim()
    dbUser.lastname = lastname.trim()

    const updatedUser = await userRepository.save(dbUser)

    return updatedUser
  }

  @Authorized()
  @Mutation(() => String)
  async deleteMyAccount(@Ctx() ctx: Context): Promise<string> {
    const userFromCtx = ctx as IUserCtx

    const test = await dataSource
      .getRepository(User)
      .delete(userFromCtx.user.userId)

    if (!test.affected) {
      throw new Error('User not found to delete')
    }

    return 'User account deleted successfully'
  }
}
