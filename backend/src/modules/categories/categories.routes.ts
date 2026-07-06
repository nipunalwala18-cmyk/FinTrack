import { Router } from 'express';
import { CategoriesController } from './categories.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} from './category.validation.js';

const router = Router();
const categoriesController = new CategoriesController();

router.use(authMiddleware as any);

router.get('/', categoriesController.getCategories);
router.post('/', validateMiddleware(createCategorySchema), categoriesController.createCategory);
router.put('/:id', validateMiddleware(updateCategorySchema), categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);
router.patch('/reorder', validateMiddleware(reorderCategoriesSchema), categoriesController.reorderCategories);

export default router;
