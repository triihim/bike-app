import express from 'express';
import AppConfig from '../config';
import bikeStationRouter from './routers/bikeStationRouter';
import { errorHandler } from './middleware/errorHandler';
import journeyRouter from './routers/journeyRouter';
import cors from 'cors';

const server = express();

server.use(cors());

server.use('/bike-stations', bikeStationRouter);
server.use('/journeys', journeyRouter);

server.use(errorHandler);

export const startServer = () => {
  server.listen(AppConfig.SERVER_PORT, () => console.log(`Server running on port ${AppConfig.SERVER_PORT}`));
};
