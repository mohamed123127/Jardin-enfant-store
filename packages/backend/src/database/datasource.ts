// src/database/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';

dotenv.config({
    path: `.env.${process.env.NODE_ENV ?? 'development'}`,
});
const options: DataSourceOptions & SeederOptions = {
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/**/*.entity.ts'],
    seeds: ['src/database/seeds/main.seeder.ts'],
    factories: ['src/database/factories/**/*.factory.ts'],
    migrations: ['dist/database/migrations/*.js'],
};

export const AppDataSource = new DataSource(options);