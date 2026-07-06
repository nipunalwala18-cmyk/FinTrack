import { Router } from 'express';
import { GoalController } from './goal.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createGoalSchema, updateGoalSchema, updateGoalStatusSchema } from './goal.validation.js';

const router = Router();
const controller = new GoalController();

router.use(authMiddleware as any);

router.get('/', controller.getGoals);
router.get('/:id', controller.getGoalById);
router.post('/', validateMiddleware(createGoalSchema), controller.createGoal);
router.put('/:id', validateMiddleware(updateGoalSchema), controller.updateGoal);
router.delete('/:id', controller.deleteGoal);
router.patch('/:id/status', validateMiddleware(updateGoalStatusSchema), controller.updateGoalStatus);

export default router;
