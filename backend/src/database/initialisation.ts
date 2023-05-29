import { DataSource } from 'typeorm';
import { BikeStation } from '../bike_stations/BikeStation.entity';
import { BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn } from '../bike_stations/csvMapping';
import AppConfig from '../config';
import CsvParser from '../csv/CsvParser';
import { Journey } from '../journeys/Journey.entity';
import { JOURNEY_COLUMN_HEADERS, journeyMapFn } from '../journeys/csvMapping';
import { getAbsoluteCsvFilepaths } from '../util';
import { APP_DATA_SOURCE_CONFIG, AppDataSource } from './dataSource';
import path from 'path';

export const initialiseBikeStationData = async () => {
  const bikeStationsCsvFolderPath = path.resolve(__dirname, '../../data/bike_stations');
  const bikeStationCsvFilepaths = await getAbsoluteCsvFilepaths(bikeStationsCsvFolderPath);

  const dataSource = new DataSource({
    ...APP_DATA_SOURCE_CONFIG,
    logging: AppConfig.DISABLE_LOGGING_DURING_DATA_IMPORT ? false : true,
  });

  await dataSource.initialize();

  const queryBuilder = dataSource.createQueryBuilder();

  const csvInsertions = bikeStationCsvFilepaths.map((csvPath) => {
    const parser = new CsvParser(csvPath, BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn);
    let insertionCount = 0;
    return parser.parse({
      bufferSize: AppConfig.DATA_IMPORT_BUFFER_SIZE,
      bufferProcessor: async (bikeStations) => {
        await queryBuilder.insert().into(BikeStation).values(bikeStations).execute();
        insertionCount += bikeStations.length;
        console.log(`So far, inserted a total of ${insertionCount} bike stations`);
      },
    });
  });

  await Promise.all(csvInsertions);
  await dataSource.destroy();
};

export const initialiseJourneyData = async () => {
  const journeysCsvFolderPath = path.resolve(__dirname, '../../data/journeys');
  const journeyCsvFilepaths = await getAbsoluteCsvFilepaths(journeysCsvFolderPath);

  const dataSource = new DataSource({
    ...APP_DATA_SOURCE_CONFIG,
    logging: AppConfig.DISABLE_LOGGING_DURING_DATA_IMPORT ? false : true,
  });

  await dataSource.initialize();

  const queryBuilder = dataSource.createQueryBuilder();

  const csvInsertions = journeyCsvFilepaths.map((csvPath) => {
    const parser = new CsvParser(csvPath, JOURNEY_COLUMN_HEADERS, journeyMapFn);
    let insertionCount = 0;
    return parser.parse({
      bufferSize: AppConfig.DATA_IMPORT_BUFFER_SIZE,
      bufferProcessor: async (journeys) => {
        await queryBuilder.insert().into(Journey).values(journeys).execute();
        insertionCount += journeys.length;
        console.log(`So far, inserted a total of ${insertionCount} journeys`);
      },
    });
  });

  await Promise.all(csvInsertions);

  // TODO: Fancier way of ensuring that journeys without an existing bike station do not end up in the db.
  //       Due to potentially huge datasets, individual insertion with row skips in case of foreign key violaton is too slow.
  //       So far I haven't figured out a way to batch insert such that journeys with invalid foreign keys would simply be skipped.

  const existingBikeStationIds = (await queryBuilder.select('id').from(BikeStation, '').execute()).map(
    (result: unknown) => (result && typeof result === 'object' && 'id' in result ? result.id : -1),
  );

  const deleteResult = await queryBuilder
    .delete()
    .from(Journey, 'journey')
    .where('return_station_id not in (:...ids) or departure_station_id not in (:...ids)', {
      ids: existingBikeStationIds,
    })
    .execute();

  console.log(`Removed ${deleteResult.affected} journeys due to non-existing departure or return bike station`);

  await dataSource.destroy();
};

export const initialiseDatabase = async () => {
  await AppDataSource.initialize();

  const bikeStationsInitialised = (await AppDataSource.getRepository(BikeStation).find({ take: 1 })).length === 1;
  const journeysInitialised = (await AppDataSource.getRepository(Journey).find({ take: 1 })).length === 1;

  if (bikeStationsInitialised) {
    console.log('Bike stations already imported');
  } else {
    await initialiseBikeStationData();
    console.log('Bike stations initialised successfully');
  }

  if (journeysInitialised) {
    console.log('Journeys already imported');
  } else {
    await initialiseJourneyData();
    console.log('Journeys initialised successfully');
  }
};
