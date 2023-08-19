import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import {
  IDocumentsController,
  ILoggerService,
  INVERSIFY_TYPES,
} from '../../types';
import { BaseController } from '../BaseController';

export class DocumentsController
  extends BaseController
  implements IDocumentsController
{
  constructor(
    @inject(INVERSIFY_TYPES.LoggerService) loggerService: ILoggerService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/',
        method: 'get',
        handler: this.read,
        middlewares: [],
      },
      {
        path: '/',
        method: 'post',
        handler: this.create,
        middlewares: [],
      },
      {
        path: '/',
        method: 'put',
        handler: this.update,
        middlewares: [],
      },
      {
        path: '/:id',
        method: 'delete',
        handler: this.delete,
        middlewares: [],
      },
    ]);
  }

  create(req: Request, res: Response, next: NextFunction) {
    this.sendResponse(res, 200, 'Created document');
  }

  read(req: Request, res: Response, next: NextFunction) {
    this.sendResponse(res, 200, 'Read documents');
  }

  update(req: Request, res: Response, next: NextFunction) {
    this.sendResponse(res, 200, 'Updated document');
  }

  delete({ params }: Request, res: Response, next: NextFunction) {
    this.sendResponse(res, 200, `Deleted document with id = ${params.id}`);
  }
}
