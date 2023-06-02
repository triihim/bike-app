import { AppDataSource } from './database/dataSource';
import { Server } from './server/server';
import path from 'path';

const main = async () => {
  try {
    const csvRootFolderPath = path.resolve(__dirname, '../data');
    const server = new Server({ csvRootFolderPath });
    await server.start();
  } catch (error) {
    console.error('Server initialisation failed', error);
    await AppDataSource.destroy();
  }
};

main();
