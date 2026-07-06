import { Router } from 'express';
import { BudgetController } from './budget.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createBudgetSchema, updateBudgetSchema } from './budget.validation.js';

const router = Router();
const controller = new BudgetController();

router.use(authMiddleware as any);

router.get('/', controller.getBudgets);
router.get('/dashboard', controller.getBudgetDashboardData);
router.get('/:id', controller.getBudgetById);
router.post('/', validateMiddleware(createBudgetSchema), controller.createBudget);
router.put('/:id', validateMiddleware(updateBudgetSchema), controller.updateBudget);
router.delete('/:id', controller.deleteBudget);

export default router;
