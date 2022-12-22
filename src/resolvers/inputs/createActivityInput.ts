import { InputType, Field } from "type-graphql";
import { ActivityType } from "../../entities/activityType";

@InputType({ description: "Create activity data" })
export class CreateActivityInput {
  @Field(() => String)
  title: string;

  @Field(() => Date, { nullable: true })
  activityDate?: Date;

  @Field(() => Number)
  carbonQuantity: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  activityTypeName: string;
}
