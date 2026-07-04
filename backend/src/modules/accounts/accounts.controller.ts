import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { AccountsService } from './accounts.service.js';

const accountsService = new AccountsService();

export class AccountsController {
  public async createAccount(
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

      const account = await accountsService.createAccount(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAccounts(
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

      const accounts = await accountsService.getAccounts(userId);

      res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default AccountsController;
