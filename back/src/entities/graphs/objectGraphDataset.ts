import { Field, ObjectType } from "type-graphql";
import {
  IGraphDataset,
  IObjectGraphDataset,
} from "../../interfaces/general/IObjectGraphDataset";
import { GraphDataset, GraphDatasetPie } from "./graphDataset";

@ObjectType()
export class ObjectGraphDataset implements IObjectGraphDataset {
  @Field(() => [String])
  labels: string[];

  @Field(() => [GraphDataset])
  datasets: IGraphDataset[];
}

@ObjectType()
export class ObjectGraphDatasetPie implements IObjectGraphDataset {
  @Field(() => [String])
  labels: string[];

  @Field(() => [GraphDatasetPie])
  datasets: IGraphDataset[];
}
