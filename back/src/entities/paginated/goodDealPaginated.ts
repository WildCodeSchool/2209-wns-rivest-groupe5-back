import { ObjectType, Field, Int } from 'type-graphql'
import { GoodDeal } from '../goodDeal'
import { IPaginatedResult } from '../../interfaces/general/IPaginatedResult'

@ObjectType()
export class GoodDealPaginatedResult implements IPaginatedResult<GoodDeal> {
  @Field(() => [GoodDeal])
  data: GoodDeal[]

  @Field(() => Int)
  total: number

  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  pageSize: number

  @Field(() => Int)
  totalPages: number
}
