import { requestLog, errorLog } from '../utils/logs';
import CreateMiddleware from '../creators/middleware';

const Logger = CreateMiddleware((req, res, next) => {
  try {
    const { method, originalUrl, body } = req;
    requestLog(method, originalUrl, body);
    next();
  } catch (err) {
    errorLog(err);
    next();
  }
});

export default Logger;
