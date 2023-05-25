import { AppDataSource } from './datasource';

const main = async () => {
  await AppDataSource.initialize();
  console.log(AppDataSource.isInitialized);
};

main();
