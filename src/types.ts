import {
  RequestHandler, Request, Response, NextFunction,
} from 'express';

export interface ICreateServerDefaultOptions {
  host?: string;
  port?: number;
  logger?: RequestHandler | false;
  controllers?: IController[];
  parsers?: RequestHandler[];
  middlewares?: RequestHandler[];
  guards?: RequestHandler[];
  errorHandler?: RequestHandler;
  disableXCofeylogs?: boolean;
  dev?: boolean;
}

export interface ICreateServerOptions extends ICreateServerDefaultOptions {
  devOptions?: ICreateServerDefaultOptions;
}

export interface IControllerProps {
  mainPath: string;
  routes: ICreateRoute[];
}

export interface IController {
  mainPath: string;
  routes?: ICreateRoute[];
  options: IControllerOptions;
}

export interface IMiddlewareGuardDefaultOptions {
  middlewares?: RequestHandler[];
  guards?: RequestHandler[];
  disableMiddlewares?: boolean;
  disableGuards?: boolean;
}

export interface IControllerOptions extends IMiddlewareGuardDefaultOptions{

}

export interface ICreateRouteOptions extends IMiddlewareGuardDefaultOptions {

}

export type IHttpMethods = 'get'
| 'post'
| 'put'
| 'patch'
| 'delete'
| 'options'
| 'head';

export interface ICreateRoute {
  method: IHttpMethods;
  path: string;
  handler: (req: Request, res: Response, next: NextFunction) => any,
  options?: ICreateRouteOptions;
}
