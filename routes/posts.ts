import express from 'express';
import { insertPost, requestInsertPostSchema, selectPostById } from '../db/db';
import { nanoid } from 'nanoid';

const postsRouter = express.Router();

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
  res.render('post', { post });
});

export default postsRouter;
