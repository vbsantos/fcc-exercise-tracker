import mysql, { Pool } from "mysql2/promise";
import { config as configEnvironmentVariables } from "dotenv";
import { injectable } from "inversify";

// Environment Variables
configEnvironmentVariables();

@injectable()
export class Repository {
  protected pool: Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: true,
      },
    });
  }
}
