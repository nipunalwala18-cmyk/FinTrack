import { AiTool, AiActionResult } from './registry/tool.interface.js';
import { prisma } from '../../../config/prisma.js';
import { TransactionType } from '@prisma/client';

export class GetMonthlySummaryTool implements AiTool {
  public name = 'getMonthlySummary';
  public description = 'Get financial overview of the current month (Total income, Total expense, Net savings, and Category spending breakdown).';
  public schema = {
    type: 'object' as const,
    properties: {},
  };

  public async execute(userId: string): Promise<AiActionResult> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Run aggregations
    const [incomeAgg, expenseAgg, categorySpending] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: TransactionType.INCOME, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: TransactionType.EXPENSE, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { userId, type: TransactionType.EXPENSE, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
    ]);

    const income = incomeAgg._sum.amount ?? 0;
    const expenses = expenseAgg._sum.amount ?? 0;
    const savings = income - expenses;

    // Resolve Category names
    const resolvedSpending = await Promise.all(
      categorySpending.map(async (item) => {
        let categoryName = 'Uncategorized';
        if (item.categoryId) {
          const cat = await prisma.category.findUnique({
            where: { id: item.categoryId },
            select: { name: true },
          });
          categoryName = cat?.name ?? 'Uncategorized';
        }
        return {
          categoryName,
          amount: item._sum.amount ?? 0,
        };
      })
    );

    // Sort categories by amount desc
    resolvedSpending.sort((a, b) => b.amount - a.amount);

    return {
      success: true,
      message: `Summary for current month: Income ₹${income}, Expenses ₹${expenses}, Net Savings ₹${savings}.`,
      data: {
        income,
        expenses,
        savings,
        categoryBreakdown: resolvedSpending,
      },
      refresh: [],
    };
  }
}

export class GetCategorySummaryTool implements AiTool {
  public name = 'getCategorySummary';
  public description = 'Get spending grouped by category over the last 3 months.';
  public schema = {
    type: 'object' as const,
    properties: {},
  };

  public async execute(userId: string): Promise<AiActionResult> {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const categorySpending = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: TransactionType.EXPENSE, date: { gte: threeMonthsAgo } },
      _sum: { amount: true },
    });

    const resolvedSpending = await Promise.all(
      categorySpending.map(async (item) => {
        let categoryName = 'Uncategorized';
        if (item.categoryId) {
          const cat = await prisma.category.findUnique({
            where: { id: item.categoryId },
            select: { name: true },
          });
          categoryName = cat?.name ?? 'Uncategorized';
        }
        return {
          categoryName,
          amount: item._sum.amount ?? 0,
        };
      })
    );

    resolvedSpending.sort((a, b) => b.amount - a.amount);

    return {
      success: true,
      message: 'Fetched category spending details for the past 3 months.',
      data: resolvedSpending,
      refresh: [],
    };
  }
}
