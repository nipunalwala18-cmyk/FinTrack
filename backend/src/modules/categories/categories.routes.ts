import { Router } from 'express';
import { CategoriesController } from './categories.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();
const categoriesController = new CategoriesController();

router.use(authMiddleware);

router.get('/', categoriesController.getCategories);
router.post('/', categoriesController.createCategory);

export default router;
