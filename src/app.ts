import express, { Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import { expressjwt, Request } from 'express-jwt';
import authRouter from '@/routes/authRouter';
import postsRouter from '@/routes/postsRouter';
import indexRouter from '@/routes/indexRouter';
import errorHandler from '@/middlewares/errorHandler';

const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');
app.use(
  helmet({
    referrerPolicy: { policy: 'same-origin' },
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
app.use(cookieParser());
app.use(favicon('./public/favicon.ico'));
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(
  expressjwt({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: (req) => {
      if (req.cookies['access_token']) {
        return req.cookies['access_token'] as string;
      }
    },
  })
);
app.use(express.static('public'));

app.use(
  /^\/(?!(login|register)).*$/,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return res.redirect('/login');
    next();
  }
);

app.use(indexRouter);
app.use(authRouter);
app.use('/posts', postsRouter);
app.use(errorHandler);

export default app;
