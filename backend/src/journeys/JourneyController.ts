import { Repository } from 'typeorm';
import { Journey } from './Journey.entity';
import { AppDataSource } from '../database/dataSource';
import { PageRequest } from '../types';
import { NextFunction, Response, Request } from 'express';
import { ApiError, ParsingError } from '../errors';
import { getOrderBy, getWhereBeginsLike, tryParseDate, tryParseInt } from '../util';
import { BikeStation } from '../bike_stations/BikeStation.entity';
import { journeyInclusionCriteria } from './journeyInclusionCriteria';

class JourneyController {
  private journeyRepository: Repository<Journey>;
  private bikeStationRepository: Repository<BikeStation>;

  constructor() {
    this.journeyRepository = AppDataSource.getRepository(Journey);
    this.bikeStationRepository = AppDataSource.getRepository(BikeStation);
  }

  page = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { start, limit, sortColumn, sortDirection, filterColumn, filterValue } = req.query;

    const validColumnNames = this.journeyRepository.metadata.columns.map((column) => column.propertyName);
    const ordering = getOrderBy(validColumnNames, sortColumn, sortDirection);
    const filtering = getWhereBeginsLike(validColumnNames, filterColumn, filterValue);

    try {
      const [journeys, count] = await this.journeyRepository.findAndCount({
        skip: start,
        take: limit,
        order: ordering || { departureStationName: 'ASC' },
        where: filtering,
      });
      return res.json({ data: journeys, count });
    } catch (error) {
      next(ApiError.internal('Something went wrong with fetching the page'));
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const departureDateTime = tryParseDate(req.body.departureDateTime, 'departure time');
      const returnDateTime = tryParseDate(req.body.returnDateTime, 'return time');
      const departureStationId = tryParseInt(req.body.departureStationId, 'departure station id');
      const returnStationId = tryParseInt(req.body.returnStationId, 'return station id');
      const coveredDistanceInMeters = tryParseInt(req.body.coveredDistanceInMeters, 'covered distance');
      const durationInSeconds = tryParseInt(req.body.durationInSeconds, 'duration');

      const departureStation = await this.bikeStationRepository.findOne({ where: { id: departureStationId } });
      const returnStation = await this.bikeStationRepository.findOne({ where: { id: returnStationId } });

      const departureIsAfterReturn = returnDateTime < departureDateTime;
      const returnIsInFuture = returnDateTime.getTime() > Date.now();

      if (departureStation === null) {
        return next(ApiError.badRequest('Given departure station does not exist'));
      }

      if (returnStation === null) {
        return next(ApiError.badRequest('Given return station does not exist'));
      }

      if (coveredDistanceInMeters < journeyInclusionCriteria.minimumDistanceMeters) {
        return next(
          ApiError.badRequest(
            'Too short journey. Minimum distance is ' + journeyInclusionCriteria.minimumDistanceMeters + ' meters',
          ),
        );
      }

      if (durationInSeconds < journeyInclusionCriteria.minimumDurationSeconds) {
        return next(
          ApiError.badRequest(
            'Too short journey. Minimum duration is ' + journeyInclusionCriteria.minimumDurationSeconds + ' seconds',
          ),
        );
      }

      if (departureIsAfterReturn) {
        return next(ApiError.badRequest('Departure cannot be after return'));
      }

      if (returnIsInFuture) {
        return next(ApiError.badRequest('Return cannot be in the future'));
      }

      const newJourney = await this.journeyRepository.save({
        return: returnDateTime,
        departure: departureDateTime,
        departureStationId: departureStation.id,
        departureStationName: departureStation.name,
        returnStationId: returnStation.id,
        returnStationName: returnStation.name,
        coveredDistanceInMeters,
        durationInSeconds,
      });

      res.status(201).json(newJourney);
    } catch (error) {
      if (error instanceof ParsingError) {
        next(ApiError.badRequest(error.message));
      } else {
        next(ApiError.badRequest('Bad request'));
      }
    }
  };
}

export default new JourneyController();
