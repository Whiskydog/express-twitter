import { Request } from 'express-jwt';
import { Response } from 'express';
import postsModel from '@/models/posts';

const showIndexPage = async (req: Request, res: Response) => {
  const posts = await postsModel.getAll();
  if (req.query.error) res.locals.error = req.query.error;
  res.render('index', { posts });
};

export default { showIndexPage };
