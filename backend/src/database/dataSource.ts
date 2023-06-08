import { DataSource, DataSourceOptions } from 'typeorm';
import AppConfig from '../config';
import { Journey } from '../journeys/Journey.entity';
import { BikeStation } from '../bike_stations/BikeStation.entity';

const { DB_HOST, DB_NAME, DB_USER, DB_PORT, DB_PASSWORD, NODE_ENV, FORCE_SYNC_DB } = AppConfig;

export const APP_DATA_SOURCE_CONFIG: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: NODE_ENV === 'development' || NODE_ENV === 'test' || FORCE_SYNC_DB,
  logging: NODE_ENV === 'development',
  entities: [Journey, BikeStation],
};

export const AppDataSource = new DataSource(APP_DATA_SOURCE_CONFIG);
