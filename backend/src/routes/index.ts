import { Router } from 'express';
import healthRouter from './health.route.js';
import authRouter from '../modules/auth/index.js';
import dashboardRouter from '../modules/dashboard/index.js';
import accountsRouter from '../modules/accounts/index.js';
import transactionsRouter from '../modules/transactions/transactions.routes.js';
import categoriesRouter from '../modules/categories/categories.routes.js';
import budgetsRouter from '../modules/budgets/budget.routes.js';
import goalsRouter from '../modules/goals/goal.routes.js';
import aiRouter from '../modules/ai/ai.routes.js';

const router = Router();

// Register modules
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/accounts', accountsRouter);
router.use('/transactions', transactionsRouter);
router.use('/categories', categoriesRouter);
router.use('/budgets', budgetsRouter);
router.use('/goals', goalsRouter);
router.use('/ai', aiRouter);
export default router;
