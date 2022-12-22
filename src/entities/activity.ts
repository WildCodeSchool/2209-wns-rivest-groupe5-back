import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IActivity } from "../interfaces/entities/IActivity";
import { ActivityType } from "./activityType";
import { User } from "./user";

@ObjectType()
@Entity()
export class Activity implements IActivity {
  @Field()
  @PrimaryGeneratedColumn()
  activityId: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ default: new Date() })
  activityDate?: Date;

  @Field()
  @Column()
  carbonQuantity: number;

  @Field()
  @Column({ nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @Field(() => ActivityType)
  @ManyToOne(() => ActivityType, (activityType) => activityType.activities)
  activityType: ActivityType;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.activities)
  user: User;
}
