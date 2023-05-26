import express from 'express';
import AppConfig from '../config';
import bikeStationRouter from './routers/bikeStationRouter';
import { errorHandler } from './middleware/errorHandler';

const server = express();

server.use('/bike-station', bikeStationRouter);

server.use(errorHandler);

export const startServer = () => {
  server.listen(AppConfig.SERVER_PORT, () => console.log(`Server running on port ${AppConfig.SERVER_PORT}`));
};
