import { NextFunction, Request, Response } from 'express';
import {
  HTTPError,
  IExceptionFilter,
  ILoggerService,
  INVERSIFY_TYPES,
} from '../../types';
import { inject, injectable } from 'inversify';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(INVERSIFY_TYPES.LoggerService)
    private loggerService: ILoggerService,
  ) {}

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (err instanceof HTTPError) {
      this.loggerService.error(
        `[${err.context}] - Status ${err.code} -  ${err.message}`,
      );

      res.status(err.code).send({ err: err.message });
    } else {
      this.loggerService.error(err.message);

      res.status(500).send({ err: err.message });
    }
  }
}
