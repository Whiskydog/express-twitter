import express from 'express';
import { selectAllPosts } from '../db/db';

const indexRouter = express.Router();

indexRouter.get('/', async (_req, res) => {
  const posts = await selectAllPosts();
  res.render('index', { posts });
});

export default indexRouter;
