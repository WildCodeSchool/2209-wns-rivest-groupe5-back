import { DataSource } from "typeorm";
import { Activity } from "../entities/activity";
import { ActivityType } from "../entities/activityType";
import { Contribution } from "../entities/contribution";
import { GoodDeal } from "../entities/goodDeal";
import { User } from "../entities/user";

const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "example",
  database: "postgres",
  synchronize: true,
  entities: [User, Activity, ActivityType, Contribution, GoodDeal],
  // logging: ["query", "error"],
});

export default dataSource;
