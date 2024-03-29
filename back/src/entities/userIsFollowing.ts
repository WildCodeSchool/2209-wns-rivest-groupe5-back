import { Field, ObjectType } from 'type-graphql'
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { IFollowing } from '../interfaces/entities/IFollowing'
import { User } from './user'

@ObjectType()
@Entity()
export class Following implements IFollowing {
  @Field()
  @PrimaryColumn()
  user: number

  @Field()
  @PrimaryColumn()
  userFollowed: number

  @ManyToOne(() => User, (user) => user.followings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  follower: User

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userFollowed' })
  followed: User
}
