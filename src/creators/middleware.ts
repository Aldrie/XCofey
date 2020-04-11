import {
  Request, Response, NextFunction,
} from 'express';

export default function CreateMiddleware(
  handler: (req: Request, res: Response, next: NextFunction) => any,
) {
  return handler;
}
