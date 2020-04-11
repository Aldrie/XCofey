import {
  Request, Response,
} from 'express';
import { IHttpMethods, ICreateRouteOptions, ICreateRoute } from '../types';

const CreateRoute = (
  method: IHttpMethods, path: string,
  handler: (req: Request, res: Response) => any, options: ICreateRouteOptions,
): ICreateRoute => ({
  path,
  method,
  handler,
  options,
});

export const Get = (
  path: string, handler: (req: Request, res: Response) => any, options?: ICreateRouteOptions,
) => CreateRoute('get', path, handler, options);

export const Post = (
  path: string, handler: (req: Request, res: Response) => any, options?: ICreateRouteOptions,
) => CreateRoute('post', path, handler, options);

export const Put = (
  path: string, handler: (req: Request, res: Response) => any, options?: ICreateRouteOptions,
) => CreateRoute('put', path, handler, options);

export const Patch = (
  path: string, handler: (req: Request, res: Response) => any, options?: ICreateRouteOptions,
) => CreateRoute('patch', path, handler, options);

export const Delete = (
  path: string, handler: (req: Request, res: Response) => any, options?: ICreateRouteOptions,
) => CreateRoute('delete', path, handler, options);

export const Options = (
  path: string, handler: (req: Request, res: Response) => any, options?: ICreateRouteOptions,
) => CreateRoute('options', path, handler, options);

export const Head = (
  path: string, handler: (req: Request, res: Response) => any, options?: ICreateRouteOptions,
) => CreateRoute('head', path, handler, options);
