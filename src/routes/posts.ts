import { Router } from 'express';
import postsController from '@/controllers/posts';

const postsRouter = Router();

postsRouter.post('/', postsController.createPost);

postsRouter.get('/:id', postsController.showPostPage);

postsRouter.post('/:id/reply', postsController.createReply);

export default postsRouter;
