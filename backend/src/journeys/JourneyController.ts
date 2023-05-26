import { Repository } from 'typeorm';
import { Journey } from './Journey.entity';
import { AppDataSource } from '../database/dataSource';
import { PageRequest } from '../types';
import { NextFunction, Response } from 'express';
import { ApiError } from '../errors';

class JourneyController {
  private journeyRepository: Repository<Journey>;

  constructor() {
    this.journeyRepository = AppDataSource.getRepository(Journey);
  }

  page = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { start, limit } = req.query;
    try {
      const [journeys, count] = await this.journeyRepository.findAndCount({ skip: start, take: limit });
      return res.json({ journeys, count });
    } catch (error) {
      next(ApiError.internal('Something went wrong with fetching the page'));
    }
  };
}

export default new JourneyController();
