import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../interfaces/entities/IUser";
import { Activity } from "./activity";
import { Contribution } from "./contribution";
import { GoodDeal } from "./goodDeal";

@ObjectType()
@Entity()
export class User implements IUser {
  @Field()
  @PrimaryGeneratedColumn()
  userId: number;

  @Field()
  @Column()
  firstname: string;

  @Field()
  @Column()
  lastname: string;

  @Field()
  @Column()
  mail: string;

  @Field()
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field()
  @Column()
  createdAt: Date;

  @Field(() => [GoodDeal], { nullable: true })
  @OneToMany(() => GoodDeal, (goodDeal) => goodDeal.user, {
    cascade: true,
  })
  goodDeals: GoodDeal[];

  @Field(() => [Activity], { nullable: true })
  @OneToMany(() => Activity, (activity) => activity.user, {
    cascade: true,
  })
  activities: Activity[];

  @Field(() => [Contribution], { nullable: true })
  @OneToMany(() => Contribution, (contribution) => contribution.user, {
    cascade: true,
  })
  contributions: Contribution[];
}
