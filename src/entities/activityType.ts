import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IActivityType } from "../interfaces/entities/IActivityType";
import { Activity } from "./activity";

@ObjectType()
@Entity()
export class ActivityType implements IActivityType {
  @Field()
  @PrimaryGeneratedColumn()
  activityTypeId: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Activity], { nullable: true })
  @OneToMany(() => Activity, (activity) => activity.activityType)
  activities: Activity[];
}
