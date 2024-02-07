import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  switch (err.name) {
    case 'UnauthorizedError':
      return res.clearCookie('access_token').status(401).redirect('/login');
  }
  console.error(err);
  res.status(500).send('Internal server error');
};

export default errorHandler;
