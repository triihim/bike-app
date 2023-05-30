import { QueryRunner, Repository } from 'typeorm';
import { BikeStation } from './BikeStation.entity';
import { AppDataSource } from '../database/dataSource';
import { NextFunction, Response } from 'express';
import { BikeStationStatistics, NumberIdRequest, PageRequest } from '../types';
import { ApiError } from '../errors';
import {
  bikeStationStatisticsQuery,
  isBikeStationAggregates,
  isBikeStationPopularityStatistic,
  popularDeparturesTo,
  popularReturnsFrom,
} from './bikeStationStatistics';
import { getOrderBy } from '../util';

class BikeStationController {
  private bikeStationRepository: Repository<BikeStation>;
  private queryRunner: QueryRunner;

  constructor() {
    this.bikeStationRepository = AppDataSource.getRepository(BikeStation);
    this.queryRunner = AppDataSource.createQueryRunner();
  }

  page = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { start, limit, sortColumn, sortDirection } = req.query;

    const validOrderingColumns = this.bikeStationRepository.metadata.columns.map((column) => column.propertyName);
    const ordering = getOrderBy(validOrderingColumns, sortColumn, sortDirection);

    try {
      const [bikeStations, count] = await this.bikeStationRepository.findAndCount({
        skip: start,
        take: limit,
        order: ordering || { name: 'ASC' },
      });
      return res.json({ data: bikeStations, count });
    } catch (error) {
      next(ApiError.internal('Something went wrong with fetching the page'));
    }
  };

  findOneById = async (req: NumberIdRequest, res: Response, next: NextFunction) => {
    const { id: requestedBikeStationId } = req.params;
    try {
      const bikeStation = await this.bikeStationRepository.findOneBy({ id: requestedBikeStationId });
      if (bikeStation === null) {
        return next(ApiError.notFound(`No bike station found with ID ${requestedBikeStationId}`));
      }
      return res.json(bikeStation);
    } catch (error) {
      next(ApiError.internal('Something went wrong and the bike station could not be fetched'));
    }
  };

  stationStatistics = async (req: NumberIdRequest, res: Response, next: NextFunction) => {
    const { id: requestedBikeStationId } = req.params;
    try {
      if (this.queryRunner.isReleased) {
        await this.queryRunner.connect();
      }

      const takeCount = 5;

      const aggregates = await this.fetchBikeStationAggregates(requestedBikeStationId);
      const topDeparturesTo = await this.fetchPopularDeparturesToStatistics(requestedBikeStationId, takeCount);
      const topReturnsFrom = await this.fetchPopularReturnsFromStatistics(requestedBikeStationId, takeCount);

      const statistics: BikeStationStatistics = {
        aggregates,
        topDeparturesTo,
        topReturnsFrom,
      };

      res.json(statistics);
    } catch (error) {
      if (error instanceof ApiError && error) {
        next(error);
      } else {
        next(ApiError.internal('Something went wrong and the bike station statistics could not be fetched'));
      }
    }
  };

  private fetchBikeStationAggregates = async (bikeStationId: number) => {
    const resultRows: Array<unknown> = await this.queryRunner.query(bikeStationStatisticsQuery, [bikeStationId]);
    if (resultRows.length === 1 && isBikeStationAggregates(resultRows[0])) {
      return resultRows[0];
    } else {
      throw ApiError.notFound(`Could not find statistics for bike station id: ${bikeStationId}`);
    }
  };

  private fetchPopularDeparturesToStatistics = async (bikeStationId: number, top: number) => {
    const resultRows: Array<unknown> = await this.queryRunner.query(popularDeparturesTo, [bikeStationId, top]);
    if (resultRows.length > 0 && resultRows.every(isBikeStationPopularityStatistic)) {
      return resultRows;
    } else {
      throw ApiError.notFound(`Could not find popular-departures-to -statistics for bike station id: ${bikeStationId}`);
    }
  };

  private fetchPopularReturnsFromStatistics = async (bikeStationId: number, top: number) => {
    const resultRows: Array<unknown> = await this.queryRunner.query(popularReturnsFrom, [bikeStationId, top]);
    if (resultRows.length > 0 && resultRows.every(isBikeStationPopularityStatistic)) {
      return resultRows;
    } else {
      throw ApiError.notFound(`Could not find popular-returns-from -statistics for bike station id: ${bikeStationId}`);
    }
  };
}

export default new BikeStationController();
