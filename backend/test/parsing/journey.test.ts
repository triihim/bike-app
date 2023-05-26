import path from 'path';
import CsvParser from '../../src/csv/CsvParser';
import { JOURNEY_COLUMN_HEADERS, journeyMapFn } from '../../src/journeys/csvMapping';

describe('Journey CSV parsing', () => {
  const csvParserBufferSize = 100; // This does not matter here, since testing csv's are small.

  it('does not discard valid rows', async () => {
    const csvPath = path.resolve(__dirname, `../test_data/journeys/valid10.csv`);
    const parser = new CsvParser(csvPath, JOURNEY_COLUMN_HEADERS, journeyMapFn);
    await parser.parse({
      bufferSize: csvParserBufferSize,
      bufferProcessor: async (journeys) => {
        expect(journeys.length).toBe(10);
      },
    });
  });

  describe('discards journey when', () => {
    test.each([
      [
        { csv: 'missing_departure_station.csv', journeyIs: 'missing departure station name or id' },
        { csv: 'missing_return_station.csv', journeyIs: 'missing return station name or id' },
        { csv: 'missing_distance.csv', journeyIs: 'missing distance' },
        { csv: 'missing_duration.csv', journeyIs: 'missing duration' },
        { csv: 'missing_time.csvs', journeyIs: 'missing departure or return time' },
        { csv: 'too_short_distance.csv', journeyIs: 'too short in meters' },
        { csv: 'too_short_distance.csv', journeyIs: 'too short in seconds' },
      ],
    ])('journey is $journeyIs', async ({ csv }) => {
      const csvPath = path.resolve(__dirname, `../test_data/journeys/${csv}`);
      const parser = new CsvParser(csvPath, JOURNEY_COLUMN_HEADERS, journeyMapFn);
      await parser.parse({
        bufferSize: csvParserBufferSize,
        bufferProcessor: async (journeys) => {
          expect(journeys.length).toBe(0);
        },
      });
    });
  });
});
