import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (err.name) {
    case 'SyntaxError':
      return res.status(400).send(err.message);
    case 'ValidationError':
      return res.status(400).send(err.message);
    case 'UnauthorizedError':
      return res.clearCookie('access_token').status(401).send(err.message);
    case 'LibsqlError':
      return res.status(400).send(err.message);
  }
  next(err);
};

export default errorHandler;
