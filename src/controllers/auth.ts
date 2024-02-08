import { Request } from 'express-jwt';
import { NextFunction, Response } from 'express';
import { requestInsertSchema, requestSelectSchema } from '@db/schemas/users';
import jwt from 'jsonwebtoken';
import usersModel from '@/models/users';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import StorageError from '@/types/StorageError';

const showLoginPage = (req: Request, res: Response) => {
  if (req.auth) return res.redirect('/');
  if (req.query.error) res.locals.error = req.query.error;
  res.render('login');
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = requestSelectSchema.parse(req.body);
    const user = await usersModel.getUser(credentials);
    if (!user) return res.redirect('/login?error=Invalid username or password');
    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2h' }
    );
    res.cookie('access_token', accessToken, { httpOnly: true }).redirect('/');
  } catch (e) {
    if (e instanceof ZodError) {
      const validationError = fromZodError(e, {
        prefix: null,
        includePath: false,
      });
      return res.redirect(`/login?error=${validationError.message}`);
    }
    next(e);
  }
};

const showRegisterPage = (req: Request, res: Response) => {
  if (req.auth) return res.redirect('/');
  if (req.query.error) res.locals.error = req.query.error;
  res.render('register');
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = requestInsertSchema.parse(req.body);
    await usersModel.createUser(newUser);
    res.redirect('/login');
  } catch (e) {
    if (e instanceof ZodError) {
      const validationError = fromZodError(e, {
        prefix: null,
        includePath: false,
      });
      return res.redirect(`/register?error=${validationError.message}`);
    } else if (e instanceof StorageError) {
      return res.redirect(`/register?error=${e.message}`);
    }
    next(e);
  }
};

const logout = (_req: Request, res: Response) => {
  res.clearCookie('access_token').redirect('/login');
};

export default { showLoginPage, login, showRegisterPage, register, logout };
