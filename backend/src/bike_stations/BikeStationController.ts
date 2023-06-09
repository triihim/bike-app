import { QueryRunner, Repository } from 'typeorm';
import { BikeStation } from './BikeStation.entity';
import { AppDataSource } from '../database/dataSource';
import { NextFunction, Request, Response } from 'express';
import { BikeStationAggregates, BikeStationStatistics, NumberIdRequest, PageRequest } from '../types';
import { ApiError } from '../errors';
import {
  bikeStationStatisticsQuery,
  isBikeStationAggregates,
  isBikeStationPopularityStatistic,
  popularDeparturesTo,
  popularReturnsFrom,
} from './bikeStationStatistics';
import { getOrderBy, getWhereBeginsLike } from '../util';

class BikeStationController {
  private bikeStationRepository: Repository<BikeStation>;
  private queryRunner: QueryRunner;

  constructor() {
    this.bikeStationRepository = AppDataSource.getRepository(BikeStation);
    this.queryRunner = AppDataSource.createQueryRunner();
  }

  page = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { start, limit, sortColumn, sortDirection, filterColumn, filterValue } = req.query;

    const validColumnNames = this.bikeStationRepository.metadata.columns.map((column) => column.propertyName);
    const ordering = getOrderBy(validColumnNames, sortColumn, sortDirection);
    const filtering = getWhereBeginsLike(validColumnNames, filterColumn, filterValue);

    try {
      const [bikeStations, count] = await this.bikeStationRepository.findAndCount({
        skip: start,
        take: limit,
        order: ordering || { name: 'ASC' },
        where: filtering,
      });
      return res.json({ data: bikeStations, count });
    } catch (error) {
      next(ApiError.internal('Something went wrong with fetching the page'));
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bikeStations = await this.bikeStationRepository.find({ order: { name: 'ASC' } });
      res.json(bikeStations);
    } catch (error) {
      next(ApiError.internal('Something went fron with fetching the bike stations'));
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
      // TypeORM returns queryRunner results as string, hence, conversion to numeric value is needed.
      return Object.entries(resultRows[0]).reduce(
        (aggregates, [property, value]) => ({ ...aggregates, [property]: +value }),
        {},
      ) as BikeStationAggregates;
    } else {
      throw ApiError.notFound(`Could not find statistics for bike station id: ${bikeStationId}`);
    }
  };

  private fetchPopularDeparturesToStatistics = async (bikeStationId: number, top: number) => {
    const resultRows: Array<unknown> = await this.queryRunner.query(popularDeparturesTo, [bikeStationId, top]);
    if (resultRows.every(isBikeStationPopularityStatistic)) {
      // TypeORM returns queryRunner results as string, hence, conversion to numeric value is needed.
      return resultRows.map((row) => ({ ...row, journey_count: +row.journey_count }));
    } else {
      throw ApiError.notFound(`Could not find popular-departures-to -statistics for bike station id: ${bikeStationId}`);
    }
  };

  private fetchPopularReturnsFromStatistics = async (bikeStationId: number, top: number) => {
    const resultRows: Array<unknown> = await this.queryRunner.query(popularReturnsFrom, [bikeStationId, top]);
    if (resultRows.every(isBikeStationPopularityStatistic)) {
      // TypeORM returns queryRunner results as string, hence, conversion to numeric value is needed.
      return resultRows.map((row) => ({ ...row, journey_count: +row.journey_count }));
    } else {
      throw ApiError.notFound(`Could not find popular-returns-from -statistics for bike station id: ${bikeStationId}`);
    }
  };
}

export default new BikeStationController();
