import { Request } from 'express-jwt';
import { NextFunction, Response } from 'express';
import { requestInsertSchema, requestSelectSchema } from '@db/schemas/users';
import { insertUser, selectUserByUsername } from '@db/db';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

const showLoginPage = (req: Request, res: Response) => {
  if (req.auth) return res.redirect('/');
  res.render('login');
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = requestSelectSchema.parse(req.body);
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
};

const showRegisterPage = (req: Request, res: Response) => {
  if (req.auth) return res.redirect('/');
  res.render('register');
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requestInsertSchema.parse(req.body);
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
};

const logout = (_req: Request, res: Response) => {
  res.clearCookie('access_token').redirect('/login');
};

export default { showLoginPage, login, showRegisterPage, register, logout };
