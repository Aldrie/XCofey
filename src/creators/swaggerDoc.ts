import { ISwaggerGenerateOpts } from '../types';

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

export default function generateSwaggerDocs(options: ISwaggerGenerateOpts) {
  const {
    host,
    port,
    title,
    description,
    paths,
    bearer,
  } = options;

  let swaggerPaths = {};
  let swaggerModels = {};

  paths.forEach((path) => {
    const { controller, routes } = path;
    routes.forEach((route) => {
      const { path: pathName, params: pathParams } = convertPath(`${controller.mainPath}${route.path}`);

      const bodyParam = route?.options?.requestModel ? {
        in: 'body',
        name: 'request',
        schema: {
          ...(!Array.isArray(route?.options?.requestModel) ? {
            $ref: `#definitions/${route?.options?.requestModel?.name}`,
          } : {
            type: 'array',
            items: {
              $ref: `#definitions/${route?.options?.requestModel[0]?.name}`,
            },
          }),
        },
      } : {};

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
          ...((Object.keys(pathParams).length > 0 || Object.keys(bodyParam).length > 0) && {
            parameters: [
              ...(pathParams && pathParams.map((item) => ({
                in: 'path',
                name: item,
              }))),
              bodyParam,
            ],
          }),
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
            ...(!Array.isArray(route?.options?.requestModel) ? {
              [route?.options?.requestModel?.name]:
              route?.options?.requestModel?.model,
            } : {
              [route?.options?.requestModel[0]?.name]:
              route?.options?.requestModel[0]?.model,
            }),
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
    host: `${host}:${port}`,
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
