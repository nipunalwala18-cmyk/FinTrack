import { Request, Response, NextFunction } from 'express';
import { BudgetService } from './budget.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { BudgetPeriod } from '@prisma/client';

const budgetService = new BudgetService();

export class BudgetController {
  public async getBudgets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const budgets = await budgetService.getBudgets(userId);
      res.status(200).json({ success: true, data: budgets });
    } catch (error) {
      next(error);
    }
  }

  public async getBudgetById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const budget = await budgetService.getBudgetById(id, userId);
      res.status(200).json({ success: true, data: budget });
    } catch (error) {
      next(error);
    }
  }

  public async createBudget(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const budget = await budgetService.createBudget(userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateBudget(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const budget = await budgetService.updateBudget(userId, id, req.body);
      res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteBudget(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      await budgetService.deleteBudget(userId, id);
      res.status(200).json({
        success: true,
        message: 'Budget deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async getBudgetDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { period } = req.query;
      const data = await budgetService.getBudgetDashboardData(
        userId,
        period ? (period as BudgetPeriod) : undefined
      );

      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
export default BudgetController;
