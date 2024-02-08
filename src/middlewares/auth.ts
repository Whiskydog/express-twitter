import { Request } from 'express-jwt';
import { NextFunction, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth) return res.redirect('/login');
  next();
};
