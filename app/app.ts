import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { expressjwt } from 'express-jwt';
import { selectUserById } from '../db/db';
import authRouter from '../routes/auth';

export const app = express();

app.set('view engine', 'pug');
app.use(helmet());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(
  expressjwt({
    secret: process.env.ACCESS_TOKEN_SECRET as string,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: (req) => {
      if (req.cookies['access_token']) {
        return req.cookies['access_token'] as string;
      }
    },
  })
);
app.use(express.static('./public'));

app.get('/', async (req, res, next) => {
  if (!req.auth) return res.redirect('/login');
  try {
    const user = (await selectUserById(req.auth.userId))[0];
    res.render('index', { displayName: user.displayName });
  } catch (e) {
    next(e);
  }
});

app.use(authRouter);
