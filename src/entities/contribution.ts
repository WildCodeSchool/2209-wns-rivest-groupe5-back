import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IContribution } from "../interfaces/entities/IContribution";
import { User } from "./user";

@ObjectType()
@Entity()
export class Contribution implements IContribution {
  @Field()
  @PrimaryGeneratedColumn()
  contributionId: number;

  @Field()
  @Column()
  amount: number;

  @Field()
  @Column()
  createdAt: Date;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.contributions)
  user: User;
}
