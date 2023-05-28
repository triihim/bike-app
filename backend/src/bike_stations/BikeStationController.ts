import { QueryRunner, Repository } from 'typeorm';
import { BikeStation } from './BikeStation.entity';
import { AppDataSource } from '../database/dataSource';
import { NextFunction, Response } from 'express';
import { NumberIdRequest, PageRequest } from '../types';
import { ApiError } from '../errors';
import { bikeStationStatisticsQuery, isBikeStationStatistics } from './bikeStationStatistics';

class BikeStationController {
  private bikeStationRepository: Repository<BikeStation>;

  constructor() {
    this.bikeStationRepository = AppDataSource.getRepository(BikeStation);
  }

  page = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { start, limit } = req.query;
    try {
      const [bikeStations, count] = await this.bikeStationRepository.findAndCount({ skip: start, take: limit });
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
    const notFoundMessage = `Could not find statistics for station id: ${requestedBikeStationId}`;
    let queryRunner: QueryRunner | undefined;

    try {
      const queryRunner = await AppDataSource.createQueryRunner();
      await queryRunner.connect();
      const resultRows: Array<unknown> = await queryRunner.query(bikeStationStatisticsQuery, [requestedBikeStationId]);

      if (resultRows.length !== 1) {
        return next(ApiError.notFound(notFoundMessage));
      }

      const row = resultRows[0];

      if (!isBikeStationStatistics(row)) {
        return next(ApiError.notFound(notFoundMessage));
      }

      res.json(row);
    } catch (error) {
      next(ApiError.internal('Something went wrong and the bike station statistics could not be fetched'));
    } finally {
      await queryRunner?.release();
    }
  };
}

export default new BikeStationController();
