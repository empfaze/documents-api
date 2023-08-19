import { NextFunction, Request, Response } from 'express';

export interface ITemplatesController {
  create: (req: Request, res: Response, next: NextFunction) => void;
  read: (req: Request, res: Response, next: NextFunction) => void;
}
