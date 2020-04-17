import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { applyServerControllers } from '../utils/appliers';
import { listenLog } from '../utils/logs';
import Logger from '../middlewares/logger';
import Environment from '../utils/useEnvironment';
import { ICreateServerOptions } from '../types';
import errorHandler from '../handlers/errorHandler';
import generateSwaggerDocs from './swaggerDoc';

export default function CreateServer(options: ICreateServerOptions) {
  const useEnvironment = Environment(options.dev, options.devOptions, options);

  const server = express();

  if (!useEnvironment('parsers')) {
    server.use(express.json());
  }

  const pathsToSwagger = applyServerControllers(server, useEnvironment('controllers'), {
    guards: useEnvironment('guards'),
    middlewares: useEnvironment('middlewares'),
  }, useEnvironment('swagger'));

  if (useEnvironment('swagger')) {
    const swaggerOpts = useEnvironment('swagger');
    server.use(swaggerOpts?.route || '/docs', swaggerUi.serve as any,
      swaggerUi.setup(
        generateSwaggerDocs(swaggerOpts?.title, swaggerOpts?.description, pathsToSwagger, useEnvironment('swagger')?.bearerAuth),
      ) as any);
  }

  if (useEnvironment('logger') !== false) {
    server.use(useEnvironment('logger') || Logger);
  }

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
