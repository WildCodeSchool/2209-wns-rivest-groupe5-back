import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import {
  activityTypeLabel,
  activityTypeName,
} from '../interfaces/entities/ActivityTypesTypesValues'
import { IActivityType } from '../interfaces/entities/IActivityType'
import { Activity } from './activity'

@ObjectType()
@Entity()
export class ActivityType implements IActivityType {
  @Field()
  @PrimaryGeneratedColumn()
  activityTypeId: number

  @Field()
  @Column({
    type: 'enum',
    enum: activityTypeName,
  })
  name: activityTypeName

  @Field()
  @Column({
    type: 'enum',
    enum: activityTypeLabel,
  })
  label: activityTypeLabel

  @Field({ nullable: true })
  @Column({ nullable: true })
  emoji?: string

  @Field()
  @Column()
  backgroundColor: string

  @Field(() => [Activity], { nullable: true })
  @OneToMany(() => Activity, (activity) => activity.activityType)
  activities: Activity[]
}
