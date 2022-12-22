import { InputType, Field } from "type-graphql";
import { ActivityType } from "../../entities/activityType";

@InputType({ description: "Update activity data" })
export class UpdateActivityInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Date, { nullable: true })
  activityDate?: Date;

  @Field(() => Number, { nullable: true })
  carbonQuantity?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  activityTypeName?: string;
}
