import { InputType, Field } from 'type-graphql'

@InputType({ description: 'update GoodDeal data' })
export class UpdateGoodDealInput {
  @Field(() => String, { nullable: true })
  goodDealTitle?: string

  @Field(() => String, { nullable: true })
  goodDealContent?: string

  @Field(() => String, { nullable: true })
  goodDealDescription?: string

  @Field(() => String, { nullable: true })
  goodDealLink?: string

  @Field(() => String, { nullable: true })
  image?: string
}
