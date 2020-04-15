import express from 'express';

import { applyServerControllers } from '../utils/appliers';
import { listenLog } from '../utils/logs';
import Logger from '../middlewares/logger';
import Environment from '../utils/useEnvironment';
import { ICreateServerOptions } from '../types';
import errorHandler from '../handlers/errorHandler';

export default function CreateServer(options: ICreateServerOptions) {
  const useEnvironment = Environment(options.dev, options.devOptions, options);

  const server = express();

  if (!useEnvironment('parsers')) {
    server.use(express.json());
  }

  if (useEnvironment('logger') !== false) {
    server.use(useEnvironment('logger') || Logger);
  }

  applyServerControllers(server, useEnvironment('controllers'), {
    guards: useEnvironment('guards'),
    middlewares: useEnvironment('middlewares'),
  });

  if (useEnvironment('errorHandler')) {
    server.use(useEnvironment('errorHandler'));
  } else {
    server.use(errorHandler);
  }

  server.listen(useEnvironment('port') || 8000, () => {
    if (!useEnvironment('disableXCofeylogs')) {
      listenLog(useEnvironment('host') || 'http//localhost', useEnvironment('port') || 8000);
    }
  });
}
