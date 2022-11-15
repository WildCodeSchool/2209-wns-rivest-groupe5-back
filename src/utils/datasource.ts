import { DataSource } from "typeorm";
import { User } from "../entities/user";

const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "example",
  database: "postgres",
  synchronize: true,
  entities: [User],
  // logging: ["query", "error"],
});

export default dataSource;
