import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import { expressjwt } from 'express-jwt';
import authRouter from '@/routes/auth';
import postsRouter from '@/routes/posts';
import rootRouter from '@/routes/root';
import errorHandler from '@/middlewares/errors';

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

app.use(authRouter);
app.use(rootRouter);
app.use('/posts', postsRouter);
app.use(errorHandler);

export default app;
