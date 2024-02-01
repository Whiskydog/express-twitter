import { Router, Response } from 'express';
import { Request } from 'express-jwt';
import postsService from '../services/postsService';

const indexRouter = Router();

indexRouter.get('/', async (_req: Request, res: Response) => {
  const posts = await postsService.getAll();
  res.render('index', { posts });
});

export default indexRouter;
