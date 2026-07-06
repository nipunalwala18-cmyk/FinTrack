import { BudgetRepository } from './budget.repository.js';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { BudgetPeriod } from '@prisma/client';

const budgetRepository = new BudgetRepository();

export class BudgetService {
  public async getBudgets(userId: string) {
    return budgetRepository.findAll(userId);
  }

  public async getBudgetById(id: string, userId: string) {
    const budget = await budgetRepository.findById(id);
    if (!budget || budget.userId !== userId) {
      throw new AppError('Budget not found', 404);
    }
    return budget;
  }

  public async createBudget(
    userId: string,
    data: {
      categoryId: string;
      period: BudgetPeriod;
      startDate: Date;
      endDate: Date;
      amount: number;
      alertAt?: number | null;
    }
  ) {
    // 1. Start date must be before end date
    if (data.startDate >= data.endDate) {
      throw new AppError('Start date must be before end date', 400);
    }

    // 2. Validate category exists, is owned by user (or default), and is of type EXPENSE
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (category.type !== 'EXPENSE') {
      throw new AppError('Budgets can only be created for Expense categories', 400);
    }

    // 3. Prevent overlapping periods for the same category
    const overlapping = await budgetRepository.findOverlappingBudget(
      userId,
      data.categoryId,
      data.period,
      data.startDate,
      data.endDate
    );

    if (overlapping) {
      throw new AppError('A budget period already overlaps for this category and period', 400);
    }

    return budgetRepository.create(userId, data);
  }

  public async updateBudget(
    userId: string,
    id: string,
    data: {
      categoryId?: string;
      period?: BudgetPeriod;
      startDate?: Date;
      endDate?: Date;
      amount?: number;
      alertAt?: number | null;
    }
  ) {
    const budget = await budgetRepository.findById(id);
    if (!budget || budget.userId !== userId) {
      throw new AppError('Budget not found', 404);
    }

    const categoryId = data.categoryId ?? budget.categoryId;
    const period = data.period ?? budget.period;
    const startDate = data.startDate ?? budget.startDate;
    const endDate = data.endDate ?? budget.endDate;

    if (startDate >= endDate) {
      throw new AppError('Start date must be before end date', 400);
    }

    // If category changed, check type
    if (data.categoryId && data.categoryId !== budget.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId,
          deletedAt: null,
        },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      if (category.type !== 'EXPENSE') {
        throw new AppError('Budgets can only be created for Expense categories', 400);
      }
    }

    // Check for overlap
    const overlapping = await budgetRepository.findOverlappingBudget(
      userId,
      categoryId,
      period,
      startDate,
      endDate,
      id
    );

    if (overlapping) {
      throw new AppError('A budget period already overlaps for this category and period', 400);
    }

    return budgetRepository.update(id, data);
  }

  public async deleteBudget(userId: string, id: string) {
    const budget = await budgetRepository.findById(id);
    if (!budget || budget.userId !== userId) {
      throw new AppError('Budget not found', 404);
    }
    return budgetRepository.delete(id);
  }

  public async getBudgetDashboardData(userId: string, period?: BudgetPeriod) {
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        period: period ?? undefined,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = await Promise.all(
      budgets.map(async (budget) => {
        const actual = await budgetRepository.getCategorySpentSum(
          userId,
          budget.categoryId,
          budget.startDate,
          budget.endDate
        );

        const remaining = budget.amount - actual;
        const percentage = budget.amount > 0 ? Math.round((actual / budget.amount) * 100) : 0;

        let status = 'ON_TRACK';
        if (percentage >= 100) {
          status = 'OVER_BUDGET';
        } else if (percentage >= 80) {
          status = 'NEAR_LIMIT';
        }

        const alertTriggered = !!(budget.alertAt && percentage >= budget.alertAt);

        return {
          id: budget.id,
          categoryId: budget.categoryId,
          category: budget.category.name,
          icon: budget.category.icon,
          color: budget.category.color,
          period: budget.period,
          budget: budget.amount,
          actual,
          remaining,
          percentage,
          status,
          alertTriggered,
          startDate: budget.startDate,
          endDate: budget.endDate,
        };
      })
    );

    return result;
  }
}
export default BudgetService;
