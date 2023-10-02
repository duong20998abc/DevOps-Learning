import { Request, Response, NextFunction } from 'express';
import ApiError from './api-error';

const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: ApiError | Error) => next(err));
  };

export { catchAsync };
