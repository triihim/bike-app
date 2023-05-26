import { NextFunction, Response } from 'express';
import { ApiError } from '../../errors';
import { PageRequest } from '../../types';
import AppConfig from '../../config';

export const requirePageRequest = (req: PageRequest, res: Response, next: NextFunction) => {
  const { start, limit } = req.query;
  if (start >= 0 && limit > 0 && limit <= AppConfig.PAGINATION_MAX_LIMIT) {
    return next();
  } else {
    return next(
      ApiError.badRequest(
        `Request query string missing: start (greater than equal to 0) and limit less than equal to ${AppConfig.PAGINATION_MAX_LIMIT}`,
      ),
    );
  }
};
