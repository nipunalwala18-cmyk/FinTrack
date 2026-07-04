import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { DashboardService } from './dashboard.service.js';

const dashboardService = new DashboardService();

export class DashboardController {
  public async getDashboardData(
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

      const data = await dashboardService.getDashboardData(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default DashboardController;
