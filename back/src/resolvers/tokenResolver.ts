import { Token } from 'graphql'
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'

@Resolver()
export class TokenResolver {
  @Authorized()
  @Query(() => Boolean)
  verifyToken() {
    return true
  }
}
