import { Router, Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import postsService from '@/services/posts';
import { formInsertSchema, requestInsertSchema } from '@db/schemas/posts';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const postsRouter = Router();

postsRouter.post(
  '/',
  async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newPost = requestInsertSchema.parse({
        content: req.body?.content as string,
        userId: req.auth?.userId,
      });
      const postId = await postsService.createNewPost(newPost);
      res.redirect(`/posts/${postId}`);
    } catch (e) {
      if (e instanceof ZodError) {
        const validationError = fromZodError(e, {
          prefix: null,
          includePath: false,
        });
        return res.redirect(`/?error=${validationError.message}`);
      }
      next(e);
    }
  }
);

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post = await postsService.getById(req.params.id);
  const replies = await postsService.getRepliesTo(req.params.id);
  if (req.query.error) res.locals.error = req.query.error;
  res.render('post', { post, replies, referrer: req.get('Referrer') });
});

postsRouter.post(
  '/:id/reply',
  async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newPost = requestInsertSchema.parse({
        content: formInsertSchema.parse(req.body).content,
        userId: req.auth?.userId,
        replyTo: req.params.id,
      });
      const postId = await postsService.createNewPost(newPost);
      res.redirect(`/posts/${postId}`);
    } catch (e) {
      if (e instanceof ZodError) {
        const validationError = fromZodError(e, {
          prefix: null,
          includePath: false,
        });
        return res.redirect(
          `/posts/${req.params.id}?error=${validationError.message}`
        );
      }
      next(e);
    }
  }
);

export default postsRouter;
