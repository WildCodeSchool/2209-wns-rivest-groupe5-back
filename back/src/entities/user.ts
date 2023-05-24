import { Field, ObjectType } from 'type-graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { IUser } from '../interfaces/entities/IUser'
import { Activity } from './activity'
import { Contribution } from './contribution'
import { GoodDeal } from './goodDeal'
import crypto from 'crypto'
import { USER_ROLES } from '../utils/userRoles'
import { GoodDealVote } from './goodDealVote'
import { userVisibility } from '../interfaces/entities/UserVisibilityOptions'
import { Following } from './userIsFollowing'

@ObjectType()
@Entity()
export class User implements IUser {
  @Field()
  @PrimaryGeneratedColumn()
  userId: number

  @Field()
  @Column()
  firstname: string

  @Field()
  @Column()
  lastname: string

  @Field()
  @Column({ unique: true })
  email: string

  @Field()
  @Column()
  password: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string

  @Field()
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @Field()
  @Column({
    type: 'enum',
    enum: userVisibility,
    default: userVisibility.private,
  })
  visibility: userVisibility

  @Field(() => [GoodDeal], { nullable: true })
  @OneToMany(() => GoodDeal, (goodDeal) => goodDeal.user, {
    cascade: true,
  })
  goodDeals: GoodDeal[]

  @Field(() => [GoodDealVote], { nullable: true })
  @OneToMany(() => GoodDealVote, (goodDealVote) => goodDealVote.user, {
    cascade: true,
  })
  goodDealVotes: GoodDealVote[]

  @Field(() => [Activity], { nullable: true })
  @OneToMany(() => Activity, (activity) => activity.user, {
    cascade: true,
  })
  activities: Activity[]

  @Field(() => [Contribution], { nullable: true })
  @OneToMany(() => Contribution, (contribution) => contribution.user, {
    cascade: true,
  })
  contributions: Contribution[]

  @OneToMany(() => Following, (following) => following.user)
  followings: Following[]

  @OneToMany(() => Following, (following) => following.userFollowed)
  followers: Following[]

  @Field({ nullable: true })
  @Column({ nullable: true })
  passwordResetToken: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  passwordResetExpires: Date

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    default: USER_ROLES.USER,
  })
  role: USER_ROLES

  public get createPasswordResetToken(): string {
    const resetToken = crypto.randomBytes(32).toString('hex')

    return resetToken
  }
}
