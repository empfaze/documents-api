import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import {
  HTTPError,
  IDocumentsController,
  ILoggerService,
  INVERSIFY_TYPES,
} from '../../types';
import { BaseController } from '../BaseController';
import { DocumentsService } from '../../services';
import { generateError } from '../../utils';

export class DocumentsController
  extends BaseController
  implements IDocumentsController
{
  constructor(
    @inject(INVERSIFY_TYPES.LoggerService) loggerService: ILoggerService,
    @inject(INVERSIFY_TYPES.DocumentsService)
    private documentsService: DocumentsService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/',
        pathname: '/documents',
        method: 'get',
        handler: this.read,
        middlewares: [],
      },
      {
        path: '/',
        pathname: '/documents',
        method: 'post',
        handler: this.create,
        middlewares: [],
      },
      {
        path: '/',
        pathname: '/documents',
        method: 'put',
        handler: this.update,
        middlewares: [],
      },
      {
        path: '/:id',
        pathname: '/documents/:id',
        method: 'delete',
        handler: this.delete,
        middlewares: [],
      },
    ]);
  }

  async create({ body }: Request, res: Response, next: NextFunction) {
    const result = await this.documentsService.create(body);

    if (!result) {
      return next(
        new HTTPError(
          422,
          'Document with such params already exists',
          'Document creation',
        ),
      );
    }

    this.sendResponse(res, 200, result);
  }

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.documentsService.read();

      this.sendResponse(res, 200, result);
    } catch (error) {
      next(generateError('read documents', error));
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    this.sendResponse(res, 200, 'Updated document');
  }

  delete({ params }: Request, res: Response, next: NextFunction) {
    this.sendResponse(res, 200, `Deleted document with id = ${params.id}`);
  }
}
