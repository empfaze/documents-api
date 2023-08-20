import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import {
  IDocumentsController,
  ILoggerService,
  INVERSIFY_TYPES,
} from '../../types';
import { BaseController } from '../BaseController';
import { DocumentsService } from '../../services';
import { generateError } from '../../utils';
import { ValidationMiddleware } from '../../middlewares';
import { DocumentDto } from '../../dto';
import { Document } from '../../entities';

const transformDocumentResponse = (document: Partial<Document>) => {
  const transformedDocument = {
    ...document,
    attributeFields: [
      ...document.dateAttributeFields!,
      ...document.numberAttributeFields!,
      ...document.stringAttributeFields!,
    ],
  };

  delete transformedDocument.dateAttributeFields;
  delete transformedDocument.numberAttributeFields;
  delete transformedDocument.stringAttributeFields;

  return transformedDocument;
};

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
        middlewares: [new ValidationMiddleware(DocumentDto)],
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
    try {
      const document = await this.documentsService.create(body);

      this.sendResponse(res, 200, transformDocumentResponse(document));
    } catch (error) {
      next(generateError('create document', error));
    }
  }

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await this.documentsService.read();

      this.sendResponse(
        res,
        200,
        documents.map((document) => transformDocumentResponse(document)),
      );
    } catch (error) {
      next(generateError('read documents', error));
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    this.sendResponse(res, 200, 'Updated document');
  }

  async delete({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      await this.documentsService.delete(id);

      this.sendResponse(res, 200, `Document with id=${id} has been deleted`);
    } catch (error) {
      next(generateError('delete document', error));
    }
  }
}
