import { Request, Response, NextFunction } from 'express';
import { GoalService } from './goal.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { GoalStatus } from '@prisma/client';

const goalService = new GoalService();

export class GoalController {
  public async getGoals(
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

      const goals = await goalService.getGoals(userId);
      res.status(200).json({ success: true, data: goals });
    } catch (error) {
      next(error);
    }
  }

  public async getGoalById(
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
      const goal = await goalService.getGoalById(id, userId);
      res.status(200).json({ success: true, data: goal });
    } catch (error) {
      next(error);
    }
  }

  public async createGoal(
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

      const goal = await goalService.createGoal(userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateGoal(
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
      const goal = await goalService.updateGoal(userId, id, req.body);
      res.status(200).json({
        success: true,
        message: 'Goal updated successfully',
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteGoal(
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
      await goalService.deleteGoal(userId, id);
      res.status(200).json({
        success: true,
        message: 'Goal deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateGoalStatus(
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
      const { status } = req.body;
      const goal = await goalService.updateGoalStatus(userId, id, status as GoalStatus);
      res.status(200).json({
        success: true,
        message: 'Goal status updated successfully',
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default GoalController;
