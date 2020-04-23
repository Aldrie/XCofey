import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { applyServerControllers } from '../utils/appliers';
import { listenLog } from '../utils/logs';
import Logger from '../middlewares/logger';
import Environment from '../utils/useEnvironment';
import { ICreateServerOptions } from '../types';
import errorHandler from '../handlers/errorHandler';
import generateSwaggerDocs from './swaggerDoc';
import HttpError from '../throwers/httpError';

export default function CreateServer(options: ICreateServerOptions) {
  const useEnvironment = Environment(options.dev, options.devOptions, options);

  const server = express();

  if (!useEnvironment('parsers')) {
    server.use(express.json());
  }

  if (useEnvironment('logger') !== false) {
    server.use(useEnvironment('logger') || Logger);
  }

  const pathsToSwagger = applyServerControllers(server, useEnvironment('controllers'), {
    guards: useEnvironment('guards'),
    middlewares: useEnvironment('middlewares'),
  }, useEnvironment('swagger'));

  if (useEnvironment('swagger') && pathsToSwagger) {
    const swaggerOpts = useEnvironment('swagger');
    const swaggerDoc = generateSwaggerDocs({
      host: useEnvironment('host') || 'localhost',
      port: useEnvironment('port') || '8000',
      title: swaggerOpts?.title,
      description: swaggerOpts?.description,
      paths: pathsToSwagger,
      bearer: useEnvironment('swagger')?.bearerAuth,
    });

    server.use(swaggerOpts?.route || '/docs', swaggerUi.serve as any, swaggerUi.setup(swaggerDoc) as any);
  }

  server.use((req, res, next) => {
    next(new HttpError(404, 'Not Found'));
  });

  if (useEnvironment('errorHandler')) {
    server.use(useEnvironment('errorHandler'));
  } else {
    server.use(errorHandler);
  }

  server.listen(useEnvironment('port') || 8000, () => {
    if (!useEnvironment('disableXCofeylogs')) {
      listenLog(useEnvironment('host') || 'http://localhost', useEnvironment('port') || 8000);
    }
  });
}
