import { initialiseDatabase } from './database/initialisation';
import { AppDataSource } from './database/datasource';

const main = async () => {
  try {
    await initialiseDatabase();
  } catch (error) {
    console.error('Database initialisation failed', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
};

main();
