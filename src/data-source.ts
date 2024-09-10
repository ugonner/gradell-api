import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from 'dotenv';
dotenv.config();
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: ["/dist/**/*.entity.js"],
    migrations: [],
})
