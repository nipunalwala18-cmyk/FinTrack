import { Router } from 'express';
import healthRouter from './health.route.js';
import authRouter from '../modules/auth/index.js';

const router = Router();

// Register modules
router.use('/health', healthRouter);
router.use('/auth', authRouter);

export default router;
