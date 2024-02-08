import { Router, Response } from 'express';
import { Request } from 'express-jwt';
import postsService from '@/services/postsService';

const rootRouter = Router();

rootRouter.get('/', async (req: Request, res: Response) => {
  const posts = await postsService.getAll();
  if (req.query.error) res.locals.error = req.query.error;
  res.render('index', { posts });
});

export default rootRouter;