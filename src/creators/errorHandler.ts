import {
  Request, Response, NextFunction,
} from 'express';
import HttpError from '../throwers/httpError';

export default function CreateErrorHandler<T = HttpError>(
  handler: (error: T, req: Request, res: Response, next: NextFunction) => any,
) {
  return handler;
}
