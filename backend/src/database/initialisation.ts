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

export const initialiseBikeStationData = async (csvRootFolderPath: string) => {
  const bikeStationsCsvFolderPath = path.resolve(csvRootFolderPath + '/bike_stations');
  const bikeStationCsvFilepaths = await getAbsoluteCsvFilepaths(bikeStationsCsvFolderPath);

  const dataSource = new DataSource({
    ...APP_DATA_SOURCE_CONFIG,
    logging: AppConfig.DISABLE_LOGGING_DURING_DATA_IMPORT ? false : true,
  });

  await dataSource.initialize();

  const queryBuilder = dataSource.createQueryBuilder();

  let insertionCount = 0;

  const csvInsertions = bikeStationCsvFilepaths.map((csvPath) => {
    const parser = new CsvParser(csvPath, BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn);
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

  return insertionCount;
};

export const initialiseJourneyData = async (csvRootFolderPath: string) => {
  const journeysCsvFolderPath = path.resolve(csvRootFolderPath + '/journeys');
  const journeyCsvFilepaths = await getAbsoluteCsvFilepaths(journeysCsvFolderPath);

  const dataSource = new DataSource({
    ...APP_DATA_SOURCE_CONFIG,
    logging: AppConfig.DISABLE_LOGGING_DURING_DATA_IMPORT ? false : true,
  });

  await dataSource.initialize();

  const queryBuilder = dataSource.createQueryBuilder();

  let insertionCount = 0;

  const csvInsertions = journeyCsvFilepaths.map((csvPath) => {
    const parser = new CsvParser(csvPath, JOURNEY_COLUMN_HEADERS, journeyMapFn);
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

  const existingBikeStationIds: Array<number> = (
    await queryBuilder.from(BikeStation, 'station').select('station.id').getRawMany()
  ).map((row) => row['station_id']);

  if (existingBikeStationIds.length > 0) {
    const deleteResult = await queryBuilder
      .delete()
      .from(Journey, 'journey')
      .where('return_station_id not in (:...ids) or departure_station_id not in (:...ids)', {
        ids: existingBikeStationIds,
      })
      .execute();

    console.log(`Removed ${deleteResult.affected} journeys due to non-existing departure or return bike station`);
  }

  await dataSource.destroy();

  return insertionCount;
};

export const initialiseDatabase = async (csvRootFolderPath: string) => {
  await AppDataSource.initialize();

  const bikeStationsInitialised = (await AppDataSource.getRepository(BikeStation).find({ take: 1 })).length === 1;
  const journeysInitialised = (await AppDataSource.getRepository(Journey).find({ take: 1 })).length === 1;

  let bikeStationInsertionCount = 0;
  let journeyInsetionCount = 0;

  if (bikeStationsInitialised) {
    console.log('Bike stations already imported');
  } else {
    bikeStationInsertionCount = await initialiseBikeStationData(csvRootFolderPath);
    console.log(`${bikeStationInsertionCount} bike stations imported successfully`);
  }

  if (journeysInitialised) {
    console.log('Journeys already imported');
  } else if (bikeStationsInitialised === false && bikeStationInsertionCount === 0) {
    console.log('No bike stations exist to connect the journeys to, skipping journey insertion');
  } else {
    journeyInsetionCount = await initialiseJourneyData(csvRootFolderPath);
    console.log(`${journeyInsetionCount} journeys imported successfully`);
  }
};
