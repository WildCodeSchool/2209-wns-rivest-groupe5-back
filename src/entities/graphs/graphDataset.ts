import { Field, ObjectType } from "type-graphql";
import {
  IGraphDataset,
  IObjectGraphDataset,
} from "../../interfaces/general/IObjectGraphDataset";

@ObjectType()
export class GraphDataset implements IGraphDataset {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  label: string;

  @Field()
  emoji: string;

  @Field()
  backgroundColor: string;

  @Field(() => [Number])
  data: number[];
}
