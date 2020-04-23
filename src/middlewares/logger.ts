import { Request, Response, NextFunction } from 'express';
import { requestLog, errorLog } from '../utils/logs';

const Logger = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { method, originalUrl, body } = req;
    requestLog(method, originalUrl, body);
    next();
  } catch (err) {
    errorLog(err);
    next();
  }
};

export default Logger;
