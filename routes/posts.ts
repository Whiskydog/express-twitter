import { Router } from 'express';
import {
  insertPost,
  requestInsertPostSchema,
  selectAllReplies,
  selectPostById,
} from '../db/db';
import { nanoid } from 'nanoid';

const postsRouter = Router();

postsRouter.post('/', async (req, res, next) => {
  try {
    const { content } = requestInsertPostSchema.parse(req.body);
    const postId = nanoid();
    const userId = req.auth?.userId;
    const newPost = {
      postId,
      content,
      timestamp: Date.now(),
      userId: String(userId),
    };
    await insertPost(newPost);
    res.redirect(`/posts/${postId}`);
  } catch (e) {
    next(e);
  }
});

postsRouter.get('/:id', async (req, res) => {
  const post = (await selectPostById(req.params.id))[0];
  const replies = await selectAllReplies(req.params.id);
  res.render('post', { post, replies, referrer: req.get('Referrer') });
});

postsRouter.post('/:id/reply', async (req, res) => {
  const { content } = requestInsertPostSchema.parse(req.body);
  const postId = nanoid();
  const userId = req.auth?.userId;
  const newPost = {
    postId,
    content,
    timestamp: Date.now(),
    userId: String(userId),
    replyTo: req.params.id,
  };
  await insertPost(newPost);
  res.redirect(`/posts/${postId}`);
});

export default postsRouter;
