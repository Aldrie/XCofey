import { IPathsToSwagger } from '../types';

const convertPath = (str) => {
  const params = [];
  const path = str.replace(/\/\//g, '/')
    .replace(/:.*?(\/|$)/g, (match) => {
      const result = match.replace(/(\/|\\|:|$)/g, '');
      params.push(result);
      return `{${result}}/`;
    });

  return {
    params,
    path,
  };
};

export default function generateSwaggerDocs(
  title?: string,
  description?: string,
  paths?: IPathsToSwagger[] | any,
  bearer?: {name?: string},
) {
  let swaggerPaths = {};
  let swaggerModels = {};

  paths.forEach((path) => {
    const { controller, routes } = path;
    routes.forEach((route) => {
      const { path: pathName, params: pathParams } = convertPath(`${controller.mainPath}${route.path}`);

      const pathObj = {
        [route.method]: {
          tags: [controller?.options?.tag || controller.mainPath],
          description: route?.options?.description,
          responses: {
            200: {
              ...(route?.options?.responseModel && {
                schema: {
                  $ref: `#definitions/${route?.options?.responseModel.name}`,
                },
              }),
            },
          },
          parameters: [
            ...(pathParams && pathParams.map((item) => ({
              in: 'path',
              name: item,
            }))),
            ...(route?.options?.requestModel && [{
              in: 'body',
              name: 'request',
              schema: {
                $ref: `#definitions/${route?.options?.requestModel.name}`,
              },
            }]),
          ],
        },
      };

      if (swaggerPaths[pathName]) {
        swaggerPaths = {
          [pathName]: {
            ...swaggerPaths[pathName],
            ...pathObj,
          },
        };
      } else {
        swaggerPaths[pathName] = {
          ...pathObj,
        };
        if (route?.options?.requestModel) {
          swaggerModels = {
            ...swaggerModels,
            [route?.options?.requestModel.name]:
              route?.options?.requestModel.model,
          };
        }

        if (route?.options?.responseModel) {
          swaggerModels = {
            ...swaggerModels,
            [route?.options?.responseModel.name]:
              route?.options?.responseModel.model,
          };
        }
      }
    });
  });

  const swagger = {
    swagger: '2.0',
    info: {
      title,
      description,
    },
    host: 'localhost:8000',
    basePath: '/',
    schemes: [
      'http',
    ],
    ...(bearer && {
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: bearer?.name || 'Authorization',
          in: 'header',
        },
      },
    }),
    paths: swaggerPaths,
    definitions: swaggerModels,
  };

  return swagger;
}
