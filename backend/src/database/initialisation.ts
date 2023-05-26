import { BikeStation } from '../bike_stations/BikeStation.entity';
import { BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn } from '../bike_stations/csvMapping';
import AppConfig from '../config';
import CsvParser from '../csv/CsvParser';
import { Journey } from '../journeys/Journey.entity';
import { JOURNEY_COLUMN_HEADERS, journeyMapFn } from '../journeys/csvMapping';
import { getAbsoluteCsvFilepaths } from '../util';
import { AppDataSource } from './dataSource';

export const initialiseBikeStationData = async () => {
  const bikeStationCsvFilepaths = await getAbsoluteCsvFilepaths('../../data/bike_stations');
  const queryBuilder = AppDataSource.createQueryBuilder();

  const insertions = bikeStationCsvFilepaths.map((csvPath) => {
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

  return Promise.all(insertions);
};

export const initialiseJourneyData = async () => {
  const journeyCsvFilepaths = await getAbsoluteCsvFilepaths('../../data/journeys');
  const queryBuilder = AppDataSource.createQueryBuilder();

  const insertions = journeyCsvFilepaths.map((csvPath) => {
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

  return Promise.all(insertions);
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
    console.log('Journeys already initialised');
  } else {
    await initialiseJourneyData();
    console.log('Journeys initialised successfully');
  }
};
