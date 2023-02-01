import { Field, ObjectType } from "type-graphql";
import {
  IGraphDataset,
  IObjectGraphDataset,
} from "../../interfaces/general/IObjectGraphDataset";
import { GraphDataset } from "./graphDataset";

@ObjectType()
export class ObjectGraphDataset implements IObjectGraphDataset {
  @Field(() => [String])
  labels: string[];

  @Field(() => [GraphDataset])
  datasets: IGraphDataset[];
}
