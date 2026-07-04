import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown[] = [];

  // Log the error for internal tracking (exclude sensitive values if required)
  if (env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.url} - ${err.stack || err.message || err}`);
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // Handle Zod Validation Errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Handle Prisma Database Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400; // default for bad inputs
    // P2002 is Unique constraint failed
    if (err.code === 'P2002') {
      statusCode = 409; // Conflict
      const targets = (err.meta?.target as string[]) || [];
      message = `Unique constraint failed on field(s): ${targets.join(', ')}`;
    } else {
      message = `Database operation failed: Code ${err.code}`;
    }
  }

  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid database request validation';
  }

  // Final Response Formatting
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;
