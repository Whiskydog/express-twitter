import express from 'express';
import { insertUser, requestInsertUserSchema } from '../db/db';
import { nanoid } from 'nanoid';
import { hash } from 'bcrypt';

const authRouter = express.Router();

authRouter.get('/login', (_req, res) => {
  res.render('login');
});

authRouter.post('/login', (_req, res) => {
  res.redirect('/');
});

authRouter.get('/register', (_req, res) => {
  res.render('register');
});

authRouter.post('/register', async (req, res) => {
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
  } catch (e) {
    console.log(e);
    res.status(500).redirect('/login');
  }
});

export default authRouter;
