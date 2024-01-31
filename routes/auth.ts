import { Router } from 'express';
import {
  insertUser,
  requestInsertUserSchema,
  requestSelectUserSchema,
  selectUserByUsername,
} from '../db/db';
import { nanoid } from 'nanoid';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from 'express-jwt';

const authRouter = Router();

authRouter.get('/login', (req: Request, res) => {
  if (req.auth) return res.redirect('/');
  res.render('login');
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = requestSelectUserSchema.parse(req.body);
    const matchedUsers = await selectUserByUsername(username);
    if (matchedUsers.length === 0) return res.redirect('/login');
    const user = matchedUsers[0];
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) return res.redirect('/login');
    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '2h' }
    );
    res.cookie('access_token', accessToken, { httpOnly: true }).redirect('/');
  } catch (error) {
    next(error);
  }
});

authRouter.get('/register', (req: Request, res) => {
  if (req.auth) return res.redirect('/');
  res.render('register');
});

authRouter.post('/register', async (req, res, next) => {
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
});

authRouter.get('/logout', (_req, res) => {
  res.clearCookie('access_token').redirect('/login');
});

export default authRouter;
