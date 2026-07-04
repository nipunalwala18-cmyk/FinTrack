import { Request, Response, NextFunction } from 'express';
import { TransactionsService } from './transactions.service.js';
import { createTransactionSchema, updateTransactionSchema } from './transactions.validation.js';

const transactionsService = new TransactionsService();

export class TransactionsController {
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const {
        search,
        type,
        categoryId,
        accountId,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 10;
      const parsedMinAmount = minAmount ? parseFloat(minAmount as string) : undefined;
      const parsedMaxAmount = maxAmount ? parseFloat(maxAmount as string) : undefined;

      const results = await transactionsService.getTransactions({
        userId,
        search: search as string,
        type: type as any,
        categoryId: categoryId as string,
        accountId: accountId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        minAmount: parsedMinAmount,
        maxAmount: parsedMaxAmount,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        page: parsedPage,
        limit: parsedLimit,
      });

      res.status(200).json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const transaction = await transactionsService.getTransactionById(req.params.id, userId);
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const parsed = createTransactionSchema.parse(req.body);
      const transaction = await transactionsService.createTransaction(userId, parsed);
      res.status(201).json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const parsed = updateTransactionSchema.parse(req.body);
      const transaction = await transactionsService.updateTransaction(req.params.id, userId, parsed);
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await transactionsService.deleteTransaction(req.params.id, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
export default TransactionsController;
