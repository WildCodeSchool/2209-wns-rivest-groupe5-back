import { DataSource } from 'typeorm'
import { Activity } from '../entities/activity'
import { ActivityType } from '../entities/activityType'
import { GoodDeal } from '../entities/goodDeal'
import { GoodDealVote } from '../entities/goodDealVote'
import { User } from '../entities/user'
import { Following } from '../entities/userIsFollowing'

console.log(
  '########## process.env.TYPEORM_MIGRATION',
  process.env.TYPEORM_MIGRATION
)

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB || 'db',
  port: 5432,
  username: 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'azerty',
  database: 'postgres',
  synchronize: true,
  entities: [Activity, ActivityType, GoodDeal, GoodDealVote, User, Following],
  migrations: [process.env.TYPEORM_MIGRATION!], // base: "src/migrations/*.ts"
  // logging: ["query", "error"],
})

export default dataSource
