import { IController, ICreateRoute, IControllerOptions } from '../types';

export default function CreateController(
  mainPath: string, routes: ICreateRoute[], options?: IControllerOptions,
): IController {
  return {
    mainPath,
    routes,
    options,
  };
}
