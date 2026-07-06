import { Request, Response, NextFunction } from 'express';
import { ReportsService } from '../service/reports.service.js';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware.js';

const reportsService = new ReportsService();

export class ReportsController {
  public async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const list = await reportsService.getReports(userId);
      res.status(200).json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  }

  public async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const report = await reportsService.getReportById(userId, req.params.id);
      res.status(200).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  public async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { type, month, year } = req.body;
      if (!type || !month || !year) {
        res.status(400).json({ success: false, message: 'type, month, and year are required' });
        return;
      }

      const report = await reportsService.generateReport(userId, type, Number(month), Number(year), 'USER');
      res.status(201).json({ success: true, message: 'Report generated successfully', data: report });
    } catch (error) {
      next(error);
    }
  }

  public async downloadReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.body;
      if (!id) {
        res.status(400).json({ success: false, message: 'id is required' });
        return;
      }

      const file = await reportsService.getReportFile(userId, id);
      res.status(200).json({ success: true, data: file });
    } catch (error) {
      next(error);
    }
  }

  public async emailReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.body;
      if (!id) {
        res.status(400).json({ success: false, message: 'id is required' });
        return;
      }

      const result = await reportsService.emailReport(userId, id);
      res.status(200).json({ success: true, message: 'Report emailed successfully', data: result });
    } catch (error) {
      next(error);
    }
  }

  public async deleteReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await reportsService.deleteReport(userId, req.params.id);
      res.status(200).json({ success: true, message: 'Report deleted successfully', data: result });
    } catch (error) {
      next(error);
    }
  }
}
export default ReportsController;
