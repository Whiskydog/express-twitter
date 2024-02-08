import { Router } from 'express';
import rootController from '@/controllers/root';

const rootRouter = Router();

rootRouter.get('/', rootController.showIndexPage);

export default rootRouter;
