import { Request } from 'express-jwt';
import { NextFunction, Response } from 'express';
import { formInsertSchema, requestInsertSchema } from '@db/schemas/posts';
import postsModel from '@/models/posts';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const createPost = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPost = requestInsertSchema.parse({
      content: formInsertSchema.parse(req.body).content,
      userId: req.auth?.userId,
    });
    const postId = await postsModel.createNewPost(newPost);
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
};

const showPostPage = async (req: Request, res: Response) => {
  const post = await postsModel.getById(req.params.id);
  const replies = await postsModel.getRepliesTo(req.params.id);
  if (req.query.error) res.locals.error = req.query.error;
  res.render('post', { post, replies, referrer: req.get('Referrer') });
};

const createReply = async (
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
    const postId = await postsModel.createNewPost(newPost);
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
};

export default { createPost, showPostPage, createReply };
