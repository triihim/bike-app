import supertest from 'supertest';
import { Server } from '../../src/server/server';
import AppConfig from '../../src/config';
import path from 'path';
import { Journey } from '../../src/journeys/Journey.entity';
import { isCorrectlySorted } from '../util';
import { AppDataSource } from '../../src/database/dataSource';

describe('Journeys API', () => {
  const server = new Server({ csvRootFolderPath: path.resolve(__dirname, '../test_data/for_api') });
  const apiPath = '/journeys';

  beforeAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.dropDatabase();
      await AppDataSource.destroy();
    }
    await server.start();
  });

  afterAll(async () => {
    await server.shutdown();
  });

  it('returns page with requested size', async () => {
    const pageStart = 0;
    const pageSize = 5;
    await supertest(server.instance)
      .get(`${apiPath}/page?start=${pageStart}&limit=${pageSize}`)
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBe(pageSize);
      });
  });

  it('refuses to return more than configured max page size', async () => {
    const pageStart = 0;
    const pageSize = AppConfig.PAGINATION_MAX_LIMIT + 1;
    await supertest(server.instance).get(`${apiPath}/page?start=${pageStart}&limit=${pageSize}`).expect(400);
  });

  describe('sorts', () => {
    test.each<{ columnName: keyof Journey; direction: 'ASC' | 'DESC' }>([
      { columnName: 'departureStationName', direction: 'ASC' },
      { columnName: 'departureStationName', direction: 'DESC' },
      { columnName: 'returnStationName', direction: 'ASC' },
      { columnName: 'returnStationName', direction: 'DESC' },
      { columnName: 'durationInSeconds', direction: 'ASC' },
      { columnName: 'durationInSeconds', direction: 'DESC' },
      { columnName: 'coveredDistanceInMeters', direction: 'DESC' },
      { columnName: 'coveredDistanceInMeters', direction: 'ASC' },
      { columnName: 'id', direction: 'ASC' },
      { columnName: 'id', direction: 'DESC' },
    ])('$columnName properly in $direction direction', async ({ columnName, direction }) => {
      const pageStart = 0;
      const pageSize = 10;
      await supertest(server.instance)
        .get(`${apiPath}/page?start=${pageStart}&limit=${pageSize}&sortColumn=${columnName}&sortDirection=${direction}`)
        .expect(200)
        .then((response) => {
          expect(isCorrectlySorted<Journey>(response.body.data, columnName as keyof Journey, direction)).toBe(true);
        });
    });
  });

  describe('filters', () => {
    test.each<{ columnName: keyof Journey; filter: string | number; count: number }>([
      { columnName: 'departureStationName', filter: 'Test Station 5', count: 1 },
      { columnName: 'returnStationName', filter: 'Test Station 10', count: 2 },
    ])('$columnName properly', async ({ columnName, filter, count }) => {
      const pageStart = 0;
      const pageSize = 10;
      await supertest(server.instance)
        .get(`${apiPath}/page?start=${pageStart}&limit=${pageSize}&filterColumn=${columnName}&filterValue=${filter}`)
        .expect(200)
        .then((response) => {
          expect(response.body.data.length).toBe(count);
          expect((response.body.data[0] as Journey)[columnName]).toEqual(filter);
        });
    });
  });
});
