import { initialiseDatabase } from './database/initialisation';
import { AppDataSource } from './database/dataSource';
import { startServer } from './server/server';

const main = async () => {
  try {
    await initialiseDatabase();
  } catch (error) {
    console.error('Database initialisation failed', error);
    await AppDataSource.destroy();
    process.exit(1);
  }

  startServer();
};

main();
