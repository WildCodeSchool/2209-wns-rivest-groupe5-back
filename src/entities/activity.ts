import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  @Column()
  activityDate: Date;

  @Field()
  @Column()
  carbonQuantity: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @Field(() => ActivityType, { nullable: true })
  @ManyToOne(() => ActivityType, (activityType) => activityType.activities)
  activityType: ActivityType;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.activities)
  user: User;
}
