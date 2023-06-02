import supertest from 'supertest';
import { AppDataSource } from '../../src/database/dataSource';
import { Server } from '../../src/server/server';
import AppConfig from '../../src/config';
import path from 'path';

describe('Bike station API', () => {
  const server = new Server({ csvRootFolderPath: path.resolve(__dirname, '../test_data/for_api') });
  const apiPath = '/bike-stations';

  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    server.shutdown();
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
});
