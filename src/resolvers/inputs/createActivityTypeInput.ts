import { InputType, Field } from "type-graphql";
import {
  activityTypeLabel,
  activityTypeName,
} from "../../interfaces/entities/ActivityTypesTypesValues";

@InputType({ description: "Create activity type data" })
export class CreateActivityTypeInput {
  @Field(() => Number)
  activityTypeId: number;

  @Field(() => String)
  name: activityTypeName;

  @Field(() => String)
  label: activityTypeLabel;

  @Field(() => String, { nullable: true })
  emoji?: string;

  @Field(() => String)
  backgroundColor: string;
}
