import express from 'express';
import { errorHandler } from './middleware/errorhandler';
import AppConfig from '../config';

const server = express();

server.get('/', (req, res) => {
  res.json({ message: 'Ping!' });
});

server.use(errorHandler);

export const startServer = () => {
  server.listen(AppConfig.SERVER_PORT, () => console.log(`Server running on port ${AppConfig.SERVER_PORT}`));
};
