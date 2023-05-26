import express from 'express';
import AppConfig from '../config';
import bikeStationRouter from './routers/bikeStationRouter';
import { errorHandler } from './middleware/errorHandler';
import journeyRouter from './routers/journeyRouter';

const server = express();

server.use('/bike-station', bikeStationRouter);
server.use('/journey', journeyRouter);

server.use(errorHandler);

export const startServer = () => {
  server.listen(AppConfig.SERVER_PORT, () => console.log(`Server running on port ${AppConfig.SERVER_PORT}`));
};
