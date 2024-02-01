import { Router, Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import {
  insertUser,
  requestInsertUserSchema,
  requestSelectUserSchema,
  selectUserByUsername,
} from '../db/db';
import { nanoid } from 'nanoid';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const authRouter = Router();

authRouter.get('/login', (req: Request, res: Response) => {
  if (req.auth) return res.redirect('/');
  res.render('login');
});

authRouter.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = requestSelectUserSchema.parse(req.body);
      const matchedUsers = await selectUserByUsername(username);
      if (matchedUsers.length === 0) return res.redirect('/login');
      const user = matchedUsers[0];
      const isPasswordCorrect = await compare(password, user.password);
      if (!isPasswordCorrect) return res.redirect('/login');
      const accessToken = jwt.sign(
        { userId: user.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2h' }
      );
      res.cookie('access_token', accessToken, { httpOnly: true }).redirect('/');
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get('/register', (req: Request, res: Response) => {
  if (req.auth) return res.redirect('/');
  res.render('register');
});

authRouter.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = requestInsertUserSchema.parse(req.body);
      const userInsert = {
        userId: nanoid(),
        username: user.username,
        password: await hash(user.password, 10),
        displayName: user.displayName,
      };
      await insertUser(userInsert);
      res.redirect('/login');
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get('/logout', (_req: Request, res: Response) => {
  res.clearCookie('access_token').redirect('/login');
});

export default authRouter;
