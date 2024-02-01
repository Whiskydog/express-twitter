import { Router, Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import postsService from '@/services/postsService';

const postsRouter = Router();

postsRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth?.userId as string;
      const content = req.body as string;
      const postId = await postsService.createNewPost(content, userId);
      res.redirect(`/posts/${postId}`);
    } catch (e) {
      next(e);
    }
  }
);

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post = await postsService.getById(req.params.id);
  const replies = await postsService.getRepliesTo(req.params.id);
  res.render('post', { post, replies, referrer: req.get('Referrer') });
});

postsRouter.post('/:id/reply', async (req: Request, res: Response) => {
  const userId = req.auth?.userId as string;
  const postId = await postsService.createNewPost(String(req.body), userId);
  res.redirect(`/posts/${postId}`);
});

export default postsRouter;
