import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateMiddleware = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Assign parsed values back to requests for strict typing if desired
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateMiddleware;
