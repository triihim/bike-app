import { Repository } from 'typeorm';
import { BikeStation } from './BikeStation.entity';
import { AppDataSource } from '../database/datasource';
import { NextFunction, Response } from 'express';
import { NumberIdRequest, PageRequest } from '../types';
import { ApiError } from '../errors';

class BikeStationController {
  private bikeStationRepository: Repository<BikeStation>;

  constructor() {
    this.bikeStationRepository = AppDataSource.getRepository(BikeStation);
  }

  page = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { start, limit } = req.query;
    try {
      const [bikeStations, count] = await this.bikeStationRepository.findAndCount({ skip: start, take: limit });
      return res.json({ bikeStations, count });
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
}

export default new BikeStationController();
