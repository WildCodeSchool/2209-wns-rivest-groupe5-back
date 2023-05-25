import { Field, ObjectType } from 'type-graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { IGoodDeal } from '../interfaces/entities/IGoodDeal'
import { GoodDealVote } from './goodDealVote'
import { User } from './user'

@ObjectType()
@Entity()
export class GoodDeal implements IGoodDeal {
  @Field()
  @PrimaryGeneratedColumn()
  goodDealId: number

  @Field()
  @Column()
  goodDealTitle: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  goodDealLink?: string

  @Field()
  @Column()
  goodDealContent: string

  @Field(() => [GoodDealVote], { nullable: true })
  @OneToMany(() => GoodDealVote, (goodDealVote) => goodDealVote.goodDeal, {
    cascade: true,
  })
  goodDealVotes: GoodDealVote[]

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string

  @Field()
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.goodDeals, { onDelete: 'CASCADE' })
  user: User
}
