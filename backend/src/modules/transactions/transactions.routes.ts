import { Router } from 'express';
import { TransactionsController } from './transactions.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();
const transactionsController = new TransactionsController();

router.use(authMiddleware);

router.get('/', transactionsController.getTransactions);
router.get('/:id', transactionsController.getTransactionById);
router.post('/', transactionsController.createTransaction);
router.put('/:id', transactionsController.updateTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

export default router;
