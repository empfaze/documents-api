import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware';

export interface IControllerRoute {
  path: string;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  middlewares?: IMiddleware[];
}
