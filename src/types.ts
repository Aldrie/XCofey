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
  swagger?: {
    title?: string;
    description?: string;
    route?: string;
    bearerAuth?: boolean | {
      name?: string;
    };
  };
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

export interface IControllerOptions extends IMiddlewareGuardDefaultOptions {
  tag?: string;
}

export interface ICreateRouteOptions extends IMiddlewareGuardDefaultOptions {
  description?: string;
  requestModel?: ICreateModel;
  responseModel?: ICreateModel;
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

export interface ISwaggerPathMethod {
  tag?: string;
  description?: string;
  requestModel?: any;
  responseModel?: any;
}

export interface ISwaggerPath {
  name: string;
  methods?: {
    get?: ISwaggerPathMethod;
    post?: ISwaggerPathMethod;
    put?: ISwaggerPathMethod;
    patch?: ISwaggerPathMethod;
    delete?: ISwaggerPathMethod;
    options?: ISwaggerPathMethod;
    head?: ISwaggerPathMethod;
  }
}

export interface IPathsToSwagger {
  controller: IController;
  routes: ICreateRoute[];
}

type ModelTypes = String | Number | Boolean | Object;

interface IModelObject {
  type: ModelTypes | IModel;
  required?: boolean,
}

type IModel = {
  [key: string]: ModelTypes | IModelObject;
};

export type Model = IModel | ModelTypes | [ModelTypes];

export interface ICreateModel {
  name: string;
  model: any;
}
