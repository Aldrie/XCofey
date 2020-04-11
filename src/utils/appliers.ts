import {
  Express, RequestHandler, IRouter, Router,
} from 'express';
import {
  IController, ICreateRoute, IControllerOptions, IMiddlewareGuardDefaultOptions,
} from 'types';

export const applyServerMiddlewares = (server: Express, middlewares: RequestHandler[]) => {
  if (server && middlewares) {
    middlewares.forEach((middleware) => server.use(middleware));
  }
};

export const applyControllerRoutes = (
  router: IRouter, routes: ICreateRoute[], controllerOptions?: IControllerOptions,
) => {
  if (routes) {
    routes.forEach((route) => {
      const {
        method, path, handler, options,
      } = route;
      let guards = [];
      let middlewares = [];

      if (!controllerOptions?.disableMiddlewares && !options?.disableMiddlewares) {
        if (controllerOptions?.middlewares) {
          middlewares = [...middlewares, ...controllerOptions.middlewares];
        }
        if (options?.middlewares) {
          middlewares = [...middlewares, ...options.middlewares];
        }
      }

      if (!controllerOptions?.disableGuards && !options?.disableGuards) {
        if (controllerOptions?.guards) {
          guards = [...guards, ...controllerOptions.guards];
        }
        if (options?.guards) {
          guards = [...guards, ...options.guards];
        }
      }

      if (middlewares) {
        if (guards) {
          return router[method](path, ...guards, ...middlewares, handler);
        }
        return router[method](path, ...middlewares, handler);
      }
      return router[method](path, handler);
    });
  }
};

export const applyServerControllers = (
  server: Express, controllers: IController[], controllerOpts?: IMiddlewareGuardDefaultOptions,
) => {
  if (controllers) {
    controllers.forEach((controller) => {
      const { mainPath, routes, options } = controller;

      const router = Router();

      const selectMiddlewares = (a: RequestHandler[], b: RequestHandler[]) => {
        if (a) {
          if (b) {
            return [...a, ...b];
          }
          return a;
        }
        return b;
      };

      applyControllerRoutes(router, routes, {
        guards: selectMiddlewares(controllerOpts?.guards, options?.guards),
        middlewares: selectMiddlewares(controllerOpts?.middlewares, options?.middlewares),
        disableGuards: controllerOpts?.disableGuards || options?.disableGuards,
        disableMiddlewares: controllerOpts?.disableMiddlewares || options?.disableMiddlewares,
      });
      server.use(mainPath, router);
    });
  }
};
