import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../config/prisma.js';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: Access token is missing', 401);
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyAccessToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        throw new AppError('Unauthorized: User not found', 401);
      }

      const authReq = req as AuthenticatedRequest;
      authReq.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      throw new AppError('Unauthorized: Access token is invalid or expired', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return next(new AppError('Unauthorized: Authentication required', 401));
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      return next(new AppError('Forbidden: Access denied', 403));
    }

    next();
  };
};
