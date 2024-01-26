import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import { expressjwt, Request } from 'express-jwt';
import { selectAllPosts } from '../db/db';
import authRouter from '../routes/auth';
import postsRouter from '../routes/posts';

const app = express();

app.set('view engine', 'pug');
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

app.get('/', async (req: Request, res, next) => {
  if (!req.auth) return res.redirect('/login');
  try {
    const posts = await selectAllPosts();
    res.render('index', { posts });
  } catch (e) {
    next(e);
  }
});

app.use(authRouter);
app.use('/posts', postsRouter);

const errorHandler: express.ErrorRequestHandler = (err, _req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.log(err.message);
    return res.clearCookie('access_token').redirect('/');
  }
  next(err);
};

app.use(errorHandler);

export default app;
