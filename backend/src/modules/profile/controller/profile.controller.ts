import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../service/profile.service.js';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware.js';

const profileService = new ProfileService();

export class ProfileController {
  public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profile = await profileService.getProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const updated = await profileService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  public async getPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const preferences = await profileService.getPreferences(userId);
      res.status(200).json({ success: true, data: preferences });
    } catch (error) {
      next(error);
    }
  }

  public async updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const updated = await profileService.updatePreferences(userId, req.body);
      res.status(200).json({ success: true, message: 'Preferences updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  public async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { profileImage } = req.body;
      if (!profileImage) {
        res.status(400).json({ success: false, message: 'profileImage URL/base64 is required' });
        return;
      }

      const avatar = await profileService.saveAvatar(userId, profileImage);
      res.status(200).json({ success: true, message: 'Avatar updated successfully', data: avatar });
    } catch (error) {
      next(error);
    }
  }

  public async getActivityLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const activities = await profileService.getActivityLogs(userId);
      res.status(200).json({ success: true, data: activities });
    } catch (error) {
      next(error);
    }
  }

  public async getReportSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const settings = await profileService.getReportSettings(userId);
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  public async updateReportSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const updated = await profileService.updateReportSettings(userId, req.body);
      res.status(200).json({ success: true, message: 'Report settings updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }
}
export default ProfileController;
