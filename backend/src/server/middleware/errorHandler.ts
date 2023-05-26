import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.code).json({ message: err.message });
  }

  res.sendStatus(500);
};
