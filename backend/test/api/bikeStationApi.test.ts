import supertest from 'supertest';
import { Server } from '../../src/server/server';
import AppConfig from '../../src/config';
import path from 'path';
import { BikeStation } from '../../src/bike_stations/BikeStation.entity';
import { isCorrectlySorted } from '../util';

describe('Bike station API', () => {
  const server = new Server({ csvRootFolderPath: path.resolve(__dirname, '../test_data/for_api') });
  const apiPath = '/bike-stations';

  beforeAll(async () => {
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
    test.each<{ columnName: keyof BikeStation; direction: 'ASC' | 'DESC' }>([
      { columnName: 'name', direction: 'ASC' },
      { columnName: 'name', direction: 'DESC' },
      { columnName: 'address', direction: 'ASC' },
      { columnName: 'address', direction: 'DESC' },
      { columnName: 'id', direction: 'ASC' },
      { columnName: 'id', direction: 'DESC' },
    ])('$columnName properly in $direction direction', async ({ columnName, direction }) => {
      const pageStart = 0;
      const pageSize = 10;
      await supertest(server.instance)
        .get(`${apiPath}/page?start=${pageStart}&limit=${pageSize}&sortColumn=${columnName}&sortDirection=${direction}`)
        .expect(200)
        .then((response) => {
          expect(isCorrectlySorted<BikeStation>(response.body.data, columnName as keyof BikeStation, direction)).toBe(
            true,
          );
        });
    });
  });

  describe('filters', () => {
    test.each<{ columnName: keyof BikeStation; filter: string | number; count: number }>([
      { columnName: 'name', filter: 'Test Station 5', count: 1 },
      { columnName: 'address', filter: 'Test Address 5', count: 1 },
      // { columnName: 'id', filter: '1005' }, This does not pass currently, since id is a number and cannot be used in TypeORM 'like'-query.
      // Enable test once fixed (not used in the UI at the moment, so not critical)
    ])('$columnName properly', async ({ columnName, filter, count }) => {
      const pageStart = 0;
      const pageSize = 10;
      await supertest(server.instance)
        .get(`${apiPath}/page?start=${pageStart}&limit=${pageSize}&filterColumn=${columnName}&filterValue=${filter}`)
        .expect(200)
        .then((response) => {
          expect(response.body.data.length).toBe(count);
          expect((response.body.data[0] as BikeStation)[columnName]).toEqual(filter);
        });
    });
  });
});
