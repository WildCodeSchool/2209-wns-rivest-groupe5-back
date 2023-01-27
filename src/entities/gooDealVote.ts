import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IGoodDealVote } from "../interfaces/entities/IGoodDealVote";
import { GoodDeal } from "./goodDeal";
import { User } from "./user";

@ObjectType()
@Entity()
export class GoodDealVote implements IGoodDealVote {
  @Field()
  @PrimaryGeneratedColumn()
  goodDealVoteId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  value: -1 | 1;

  @Field()
  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @Field(() => GoodDeal)
  @ManyToOne(() => GoodDeal, (goodDeal) => goodDeal.goodDealVotes)
  goodDeal: GoodDeal;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.goodDealVotes)
  user: User;
}
