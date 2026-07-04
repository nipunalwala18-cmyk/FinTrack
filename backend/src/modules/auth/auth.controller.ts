import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../../utils/cookies.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { env } from '../../config/env.js';

const authService = new AuthService();

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data, rawRefreshToken } = await authService.register(req.body);
      setRefreshTokenCookie(res, rawRefreshToken);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data, rawRefreshToken } = await authService.login(req.body);
      setRefreshTokenCookie(res, rawRefreshToken);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Refresh token is missing',
        });
        return;
      }

      const { accessToken, rawRefreshToken } = await authService.refresh(token);
      setRefreshTokenCookie(res, rawRefreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (authReq.user?.id) {
        await authService.logout(authReq.user.id);
      }
      clearRefreshTokenCookie(res);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user?.id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const profile = await authService.getUserProfile(authReq.user.id);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  public async googleOAuthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = req.user as any;
      if (!profile) {
        res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
        return;
      }

      const { data, rawRefreshToken } = await authService.handleGoogleOAuth(profile);
      setRefreshTokenCookie(res, rawRefreshToken);

      res.redirect(`${env.FRONTEND_URL}/oauth-callback?token=${data.accessToken}`);
    } catch (error) {
      next(error);
    }
  }
}
export default AuthController;
