import { DataSource } from 'typeorm';
import AppConfig from './config';

const { DB_HOST, DB_NAME, DB_USER, DB_PORT, DB_PASSWORD, ENV } = AppConfig;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: ENV === 'development',
  logging: ENV === 'development',
  entities: ['./**/*.entity.ts'],
});
