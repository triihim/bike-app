import path from 'path';
import CsvParser from '../../src/csv/CsvParser';
import { BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn } from '../../src/bike_stations/csvMapping';

describe('Bike station CSV parsing', () => {
  const csvParserBufferSize = 100; // This does not matter here, since testing csv's are small.

  it('discards rows missing any of the following: id, address, name, capacity, x, y', async () => {
    const csvPath = path.resolve(__dirname, '../test_data/bike_stations/invalid5.csv');
    const parser = new CsvParser(csvPath, BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn);
    await parser.parse({
      bufferSize: csvParserBufferSize,
      bufferProcessor: async (bikeStations) => {
        expect(bikeStations.length).toBe(0);
      },
    });
  });

  it('fallbacks to Helsinki if city is missing', async () => {
    const csvPath = path.resolve(__dirname, '../test_data/bike_stations/missing_city.csv');
    const parser = new CsvParser(csvPath, BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn);
    await parser.parse({
      bufferSize: csvParserBufferSize,
      bufferProcessor: async (bikeStations) => {
        const { city } = bikeStations[0];
        expect(city).toBe('Helsinki');
      },
    });
  });

  it('does not discard rows containing all of the following: id, address, name, capacity, x, y', async () => {
    const csvPath = path.resolve(__dirname, '../test_data/bike_stations/valid10.csv');
    const parser = new CsvParser(csvPath, BIKE_STATION_COLUMN_HEADERS, bikeStationMapFn);
    await parser.parse({
      bufferSize: csvParserBufferSize,
      bufferProcessor: async (bikeStations) => {
        expect(bikeStations.length).toBe(10);
      },
    });
  });
});
