import { Router } from 'express';
import authController from '@/controllers/auth';
import authMiddleware from '@/middlewares/auth';

const authRouter = Router();

authRouter.use(/^\/(?!(login|register)).*$/, authMiddleware);

authRouter.get('/login', authController.showLoginPage);
authRouter.post('/login', authController.login);

authRouter.get('/register', authController.showRegisterPage);
authRouter.post('/register', authController.register);

authRouter.get('/logout', authController.logout);

export default authRouter;
