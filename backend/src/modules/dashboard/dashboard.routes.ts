import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { getDashboardSchema } from './dashboard.validation.js';

const router = Router();
const controller = new DashboardController();

router.get(
  '/',
  authMiddleware as any,
  validateMiddleware(getDashboardSchema),
  controller.getDashboardData
);

export default router;
