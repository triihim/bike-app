import express from 'express';
import { errorHandler } from './middleware/errorhandler';
import AppConfig from '../config';
import bikeStationRouter from './routers/bikestation';

const server = express();

server.use('/bike-station', bikeStationRouter);

server.use(errorHandler);

export const startServer = () => {
  server.listen(AppConfig.SERVER_PORT, () => console.log(`Server running on port ${AppConfig.SERVER_PORT}`));
};
