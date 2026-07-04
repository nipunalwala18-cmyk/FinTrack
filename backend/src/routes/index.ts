import { Router } from 'express';
import healthRouter from './health.route.js';
import authRouter from '../modules/auth/index.js';
import dashboardRouter from '../modules/dashboard/index.js';
import accountsRouter from '../modules/accounts/index.js';
import transactionsRouter from '../modules/transactions/transactions.routes.js';
import categoriesRouter from '../modules/categories/categories.routes.js';

const router = Router();

// Register modules
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/accounts', accountsRouter);
router.use('/transactions', transactionsRouter);
router.use('/categories', categoriesRouter);

export default router;
