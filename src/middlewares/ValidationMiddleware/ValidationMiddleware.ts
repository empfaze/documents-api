import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IMiddleware } from '../../types';

export class ValidationMiddleware implements IMiddleware {
  constructor(private instanceClass: ClassConstructor<object>) {}

  execute({ body }: Request, res: Response, next: NextFunction) {
    const mappedData = plainToInstance(this.instanceClass, body);

    validate(mappedData).then((errors) => {
      if (errors.length) {
        res.status(422).send(errors);

        return;
      }

      next();
    });
  }
}
