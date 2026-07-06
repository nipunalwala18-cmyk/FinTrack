import { TransactionType } from '@prisma/client';
import { CategoryRepository } from './category.repository.js';
import { AppError } from '../../utils/AppError.js';

const categoryRepository = new CategoryRepository();

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: TransactionType.INCOME, color: '#10B981', icon: 'briefcase', isDefault: true },
  { name: 'Freelance', type: TransactionType.INCOME, color: '#34D399', icon: 'laptop', isDefault: true },
  { name: 'Investments', type: TransactionType.INCOME, color: '#60A5FA', icon: 'trending-up', isDefault: true },
  { name: 'Food & Dining', type: TransactionType.EXPENSE, color: '#F87171', icon: 'utensils', isDefault: true },
  { name: 'Shopping', type: TransactionType.EXPENSE, color: '#F472B6', icon: 'shopping-bag', isDefault: true },
  { name: 'Travel & Transport', type: TransactionType.EXPENSE, color: '#FBBF24', icon: 'car', isDefault: true },
  { name: 'Rent & Housing', type: TransactionType.EXPENSE, color: '#FB7185', icon: 'home', isDefault: true },
  { name: 'Utilities', type: TransactionType.EXPENSE, color: '#A78BFA', icon: 'zap', isDefault: true },
  { name: 'Entertainment', type: TransactionType.EXPENSE, color: '#EC4899', icon: 'tv', isDefault: true },
];

export class CategoriesService {
  public async getCategories(userId: string) {
    let categories = await categoryRepository.findAll(userId);

    // Auto-seed defaults if user has no categories at all
    if (categories.length === 0) {
      await Promise.all(
        DEFAULT_CATEGORIES.map((cat, idx) =>
          categoryRepository.create(userId, {
            ...cat,
            sortOrder: idx,
          })
        )
      );
      categories = await categoryRepository.findAll(userId);
    }

    // Fetch transaction sums grouped by categoryId
    const sums = await categoryRepository.getTransactionSums(userId);
    const amountMap = new Map<string, number>();
    for (const s of sums) {
      if (s.categoryId) {
        amountMap.set(s.categoryId, s._sum.amount ?? 0);
      }
    }

    // Build the nested tree (1 level deep)
    const rootCategories: any[] = [];
    const childrenMap = new Map<string, any[]>();

    for (const cat of categories) {
      const directSum = amountMap.get(cat.id) || 0;
      const catWithTotals = {
        ...cat,
        spent: cat.type === 'EXPENSE' ? directSum : 0,
        received: cat.type === 'INCOME' ? directSum : 0,
        children: [] as any[],
      };

      if (cat.parentId) {
        if (!childrenMap.has(cat.parentId)) {
          childrenMap.set(cat.parentId, []);
        }
        childrenMap.get(cat.parentId)!.push(catWithTotals);
      } else {
        rootCategories.push(catWithTotals);
      }
    }

    for (const root of rootCategories) {
      const children = childrenMap.get(root.id) || [];
      root.children = children.sort((a, b) => a.sortOrder - b.sortOrder);

      // Accumulate child sums into parent category
      let childSpentSum = 0;
      let childReceivedSum = 0;
      for (const child of root.children) {
        childSpentSum += child.spent;
        childReceivedSum += child.received;
      }
      root.spent += childSpentSum;
      root.received += childReceivedSum;
    }

    return rootCategories.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async createCategory(
    userId: string,
    data: { name: string; type: TransactionType; color?: string | null; icon?: string | null; parentId?: string | null }
  ) {
    const parentId = data.parentId || null;

    // 1. Uniqueness check
    const existing = await categoryRepository.findByNameAndParent(userId, data.name, parentId);
    if (existing) {
      throw new AppError('Category with this name already exists under the same parent', 400);
    }

    // 2. Parent checks
    if (parentId) {
      const parent = await categoryRepository.findById(parentId);
      if (!parent || parent.userId !== userId) {
        throw new AppError('Parent category not found', 404);
      }
      if (parent.parentId) {
        throw new AppError('Cannot nest categories deeper than one level', 400);
      }
      if (parent.type !== data.type) {
        throw new AppError('Parent and child must have the same category type', 400);
      }
    }

    // 3. Find next sort order
    const siblings = await categoryRepository.findAll(userId);
    const parentSiblings = siblings.filter((c) => c.parentId === parentId);
    const nextSortOrder = parentSiblings.length > 0 ? Math.max(...parentSiblings.map((s) => s.sortOrder)) + 1 : 0;

    return categoryRepository.create(userId, {
      ...data,
      parentId,
      sortOrder: nextSortOrder,
      isDefault: false,
    });
  }

  public async updateCategory(
    userId: string,
    id: string,
    data: { name?: string; type?: TransactionType; color?: string | null; icon?: string | null; parentId?: string | null }
  ) {
    const category = await categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new AppError('Category not found', 404);
    }

    const parentId = data.parentId !== undefined ? data.parentId : category.parentId;
    const name = data.name !== undefined ? data.name : category.name;
    const type = data.type !== undefined ? data.type : category.type;

    // 1. Check uniqueness if parent or name changes
    if (name !== category.name || parentId !== category.parentId) {
      const existing = await categoryRepository.findByNameAndParent(userId, name, parentId);
      if (existing && existing.id !== id) {
        throw new AppError('Category with this name already exists under the same parent', 400);
      }
    }

    // 2. Parent checks
    if (parentId) {
      if (parentId === id) {
        throw new AppError('Category cannot be its own parent', 400);
      }

      const parent = await categoryRepository.findById(parentId);
      if (!parent || parent.userId !== userId) {
        throw new AppError('Parent category not found', 404);
      }
      if (parent.parentId) {
        throw new AppError('Cannot nest categories deeper than one level', 400);
      }
      if (parent.type !== type) {
        throw new AppError('Parent and child must have the same category type', 400);
      }

      // If category has children, it cannot become a child itself
      const childrenCount = await categoryRepository.countChildren(id);
      if (childrenCount > 0) {
        throw new AppError('This category has subcategories and cannot become a child category itself', 400);
      }
    }

    return categoryRepository.update(id, {
      name: data.name,
      type: data.type,
      color: data.color,
      icon: data.icon,
      parentId,
    });
  }

  public async deleteCategory(userId: string, id: string, reassignToId?: string) {
    const category = await categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new AppError('Category not found', 404);
    }

    // 1. Default categories cannot be deleted
    if (category.isDefault) {
      throw new AppError('Default categories cannot be deleted', 400);
    }

    // 2. Check child categories
    const childrenCount = await categoryRepository.countChildren(id);
    if (childrenCount > 0) {
      throw new AppError('Cannot delete category with subcategories. Remove or reassign subcategories first.', 400);
    }

    // 3. Check transactions
    const transactionCount = await categoryRepository.countTransactions(id);
    if (transactionCount > 0) {
      if (!reassignToId) {
        return {
          requireReassignment: true,
          transactionCount,
          message: 'Category contains active transactions. Please select a category to reassign them to.',
        };
      }

      if (reassignToId === id) {
        throw new AppError('Cannot reassign transactions to the category being deleted', 400);
      }

      const targetCategory = await categoryRepository.findById(reassignToId);
      if (!targetCategory || targetCategory.userId !== userId) {
        throw new AppError('Reassignment category not found', 404);
      }
      if (targetCategory.type !== category.type) {
        throw new AppError('Reassignment category must have the same type', 400);
      }

      // Reassign transactions
      await categoryRepository.reassignTransactions(id, reassignToId);
    }

    await categoryRepository.softDelete(id);
    return { success: true };
  }

  public async reorderCategories(
    userId: string,
    categoriesData: { id: string; sortOrder: number; parentId: string | null }[]
  ) {
    // 1. Validate all categories belong to user
    const dbCategories = await categoryRepository.findAll(userId);
    const dbIds = new Set(dbCategories.map((c) => c.id));

    for (const item of categoriesData) {
      if (!dbIds.has(item.id)) {
        throw new AppError(`Category ${item.id} not found or access denied`, 404);
      }
      if (item.parentId && !dbIds.has(item.parentId)) {
        throw new AppError(`Parent category ${item.parentId} not found or access denied`, 404);
      }

      // Validate hierarchy depth limits: if item has parent, the parent itself must not have parent
      if (item.parentId) {
        const parent = dbCategories.find((c) => c.id === item.parentId);
        if (parent && parent.parentId) {
          throw new AppError('Cannot nest categories deeper than one level', 400);
        }
      }
    }

    await categoryRepository.updateSortOrders(categoriesData);
    return { success: true };
  }
}
export default CategoriesService;
