import { Repository } from 'typeorm';
import { Journey } from './Journey.entity';
import { AppDataSource } from '../database/dataSource';
import { PageRequest } from '../types';
import { NextFunction, Response } from 'express';
import { ApiError } from '../errors';
import { getOrderBy } from '../util';

class JourneyController {
  private journeyRepository: Repository<Journey>;

  constructor() {
    this.journeyRepository = AppDataSource.getRepository(Journey);
  }

  page = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { start, limit, sortColumn, sortDirection } = req.query;

    const validOrderingColumns = this.journeyRepository.metadata.columns.map((column) => column.propertyName);
    const ordering = getOrderBy(validOrderingColumns, sortColumn, sortDirection);

    try {
      const [journeys, count] = await this.journeyRepository.findAndCount({
        skip: start,
        take: limit,
        order: ordering || { departureStationName: 'ASC' },
      });
      return res.json({ data: journeys, count });
    } catch (error) {
      next(ApiError.internal('Something went wrong with fetching the page'));
    }
  };
}

export default new JourneyController();
