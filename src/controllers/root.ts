import { Request } from 'express-jwt';
import { Response } from 'express';
import postsService from '@/services/posts';

const showIndexPage = async (req: Request, res: Response) => {
  const posts = await postsService.getAll();
  if (req.query.error) res.locals.error = req.query.error;
  res.render('index', { posts });
};

export default { showIndexPage };
