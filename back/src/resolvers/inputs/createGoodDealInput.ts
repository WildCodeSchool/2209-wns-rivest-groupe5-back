import { InputType, Field } from 'type-graphql'

@InputType({ description: 'Create GoodDeal data' })
export class CreateGoodDealInput {
  @Field(() => String)
  goodDealTitle: string

  @Field(() => String)
  goodDealContent: string

  @Field(() => String, { nullable: true })
  goodDealLink?: string

  @Field(() => String, { nullable: true })
  image?: string
}
