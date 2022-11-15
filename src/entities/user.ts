import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../interfaces/entities/IUser";

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
}
