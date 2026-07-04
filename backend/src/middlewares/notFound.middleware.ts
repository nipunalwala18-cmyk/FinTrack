import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, 404));
};

export default notFoundMiddleware;
