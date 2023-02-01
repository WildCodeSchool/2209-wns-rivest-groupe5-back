import { Field, ObjectType } from "type-graphql";
import { IGraphDataset } from "../../interfaces/general/IObjectGraphDataset";

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

@ObjectType()
export class GraphDatasetPie implements IGraphDataset {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  label: string;

  @Field(() => [String])
  emoji: string[];

  @Field(() => [String])
  backgroundColor: string[];

  @Field(() => [Number])
  data: number[];
}
