import { Router } from 'express';
import { AccountsController } from './accounts.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createAccountSchema } from './accounts.validation.js';

const router = Router();
const controller = new AccountsController();

router.post(
  '/',
  authMiddleware as any,
  validateMiddleware(createAccountSchema),
  controller.createAccount
);

router.get(
  '/',
  authMiddleware as any,
  controller.getAccounts
);

export default router;
