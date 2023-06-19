import { ObjectType, Field, Int } from 'type-graphql'
import { Activity } from '../activity'
import { IPaginatedResult } from '../../interfaces/general/IPaginatedResult'

@ObjectType()
export class ActivityPaginatedResult implements IPaginatedResult<Activity> {
  @Field(() => [Activity])
  data: Activity[]

  @Field(() => Int)
  total: number

  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  pageSize: number

  @Field(() => Int)
  totalPages: number
}
