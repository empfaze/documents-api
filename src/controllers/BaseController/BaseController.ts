import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { IControllerRoute, ILoggerService } from '../../types';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: ILoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public sendResponse<T>(res: Response, code: number, message: T) {
    res.type('application/json');

    return res.status(code).json(message);
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    routes.forEach(({ method, path, pathname, handler, middlewares }) => {
      this.logger.log(`[${method}] ${pathname}`);

      const mainHandler = handler.bind(this);

      const bindedMiddlewares = middlewares?.map((middleware) =>
        middleware.execute.bind(middleware),
      );

      const pipeline = bindedMiddlewares
        ? [...bindedMiddlewares, mainHandler]
        : mainHandler;

      this.router[method](path, pipeline);
    });
  }
}
