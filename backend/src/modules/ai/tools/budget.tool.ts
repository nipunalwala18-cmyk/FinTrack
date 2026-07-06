import { AiTool, AiActionResult } from './registry/tool.interface.js';
import { BudgetService } from '../../budgets/budget.service.js';
import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../utils/AppError.js';
import { BudgetPeriod } from '@prisma/client';

const budgetService = new BudgetService();

// Helper to resolve Expense Category Name to ID
async function resolveExpenseCategoryId(userId: string, name: string): Promise<string> {
  const category = await prisma.category.findFirst({
    where: {
      deletedAt: null,
      name: { contains: name, mode: 'insensitive' },
      type: 'EXPENSE',
      OR: [
        { userId },
        { isDefault: true },
      ],
    },
  });

  if (!category) {
    // Let's create an expense category if not found
    const newCat = await prisma.category.create({
      data: {
        userId,
        name,
        type: 'EXPENSE',
        color: '#f59e0b',
        icon: 'Compass',
      },
    });
    return newCat.id;
  }
  return category.id;
}

export class CreateBudgetTool implements AiTool {
  public name = 'createBudget';
  public description = 'Create a monthly, weekly, or yearly budget for a specific expense category.';
  public schema = {
    type: 'object' as const,
    properties: {
      categoryName: {
        type: 'string',
        description: 'The expense category name (e.g. Food, Entertainment).',
      },
      amount: {
        type: 'number',
        description: 'Budget limit amount in INR.',
      },
      period: {
        type: 'string',
        enum: [BudgetPeriod.WEEKLY, BudgetPeriod.MONTHLY, BudgetPeriod.YEARLY],
        description: 'The period of the budget. Defaults to MONTHLY.',
      },
      alertAt: {
        type: 'number',
        description: 'Alert threshold percentage (e.g., 80 to alert at 80% spending). Optional.',
      },
    },
    required: ['categoryName', 'amount'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const categoryId = await resolveExpenseCategoryId(userId, input.categoryName);
    const period = input.period || BudgetPeriod.MONTHLY;

    // Set dates based on period
    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    if (period === BudgetPeriod.WEEKLY) {
      const currentDay = now.getDay();
      const distance = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // start of week (Monday)
      startDate = new Date(now.setDate(distance));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === BudgetPeriod.YEARLY) {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    const newBudget = await budgetService.createBudget(userId, {
      categoryId,
      period,
      startDate,
      endDate,
      amount: input.amount,
      alertAt: input.alertAt || 80,
    });

    return {
      success: true,
      message: `Successfully created ${newBudget.period.toLowerCase()} budget of ₹${newBudget.amount} for category '${input.categoryName}'.`,
      data: newBudget,
      refresh: ['budgets', 'dashboard'],
    };
  }
}

export class UpdateBudgetTool implements AiTool {
  public name = 'updateBudget';
  public description = 'Update budget limit or alert settings for an existing budget.';
  public schema = {
    type: 'object' as const,
    properties: {
      budgetId: {
        type: 'string',
        description: 'The ID of the budget to update.',
      },
      amount: {
        type: 'number',
        description: 'New budget limit amount.',
      },
      alertAt: {
        type: 'number',
        description: 'New alert percentage threshold.',
      },
    },
    required: ['budgetId'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const payload: any = {};
    if (input.amount !== undefined) payload.amount = input.amount;
    if (input.alertAt !== undefined) payload.alertAt = input.alertAt;

    const updated = await budgetService.updateBudget(userId, input.budgetId, payload);

    return {
      success: true,
      message: `Successfully updated budget. New limit: ₹${updated.amount}, alert threshold: ${updated.alertAt}%.`,
      data: updated,
      refresh: ['budgets', 'dashboard'],
    };
  }
}

export class GetBudgetStatusTool implements AiTool {
  public name = 'getBudgetStatus';
  public description = 'Get a summary of current budgets, actual category spending, and remaining amounts.';
  public schema = {
    type: 'object' as const,
    properties: {},
  };

  public async execute(userId: string): Promise<AiActionResult> {
    // Fetch budgets for user
    const budgets = await budgetService.getBudgets(userId);
    
    // For each budget, calculate category actual spending
    const richBudgets = await Promise.all(
      budgets.map(async (b) => {
        const spentResult = await prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: b.categoryId,
            type: 'EXPENSE',
            date: { gte: b.startDate, lte: b.endDate },
          },
          _sum: { amount: true },
        });

        const spent = spentResult._sum.amount ?? 0;
        const remaining = Math.max(0, b.amount - spent);
        const progress = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;

        return {
          ...b,
          spent,
          remaining,
          progress,
        };
      })
    );

    return {
      success: true,
      message: `Fetched status for ${richBudgets.length} budgets.`,
      data: richBudgets,
      refresh: [],
    };
  }
}
