import { Repository } from 'typeorm';
import { BikeStation } from './BikeStation.entity';
import { AppDataSource } from '../database/datasource';
import { NextFunction, Response } from 'express';
import { PageRequest } from '../types';
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
}

export default new BikeStationController();
