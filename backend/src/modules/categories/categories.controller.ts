import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service.js';

const categoriesService = new CategoriesService();

export class CategoriesController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const categories = await categoriesService.getCategories(userId);
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const category = await categoriesService.createCategory(userId, req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }
}
