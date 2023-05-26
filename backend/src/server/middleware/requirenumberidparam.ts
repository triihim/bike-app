import { NextFunction, Response } from 'express';
import { ApiError } from '../../errors';
import { NumberIdRequest } from '../../types';

export const requireNumberIdParam = (req: NumberIdRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (isNaN(id)) {
    next(ApiError.badRequest('Non-numeric ID provided'));
  } else {
    next();
  }
};
