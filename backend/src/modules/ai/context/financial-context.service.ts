import { prisma } from '../../../config/prisma.js';

export class FinancialContextService {
  public async getFinancialContext(userId: string) {
    const [accounts, categories, goals, budgets, transactions] = await Promise.all([
      prisma.account.findMany({
        where: { userId, isArchived: false },
        select: { id: true, name: true, type: true, balance: true },
      }),
      prisma.category.findMany({
        where: { deletedAt: null, OR: [{ userId }, { isDefault: true }] },
        select: { id: true, name: true, type: true },
      }),
      prisma.goal.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { id: true, name: true, targetAmount: true, currentAmount: true, targetDate: true },
      }),
      prisma.budget.findMany({
        where: { userId },
        select: { id: true, categoryId: true, amount: true, period: true, startDate: true, endDate: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10,
        select: {
          id: true,
          amount: true,
          description: true,
          type: true,
          date: true,
          category: { select: { name: true } },
          account: { select: { name: true } },
        },
      }),
    ]);

    const enrichedBudgets = budgets.map((b) => {
      const cat = categories.find((c) => c.id === b.categoryId);
      return {
        id: b.id,
        categoryName: cat?.name ?? 'Unknown',
        amount: b.amount,
        period: b.period,
        startDate: b.startDate,
        endDate: b.endDate,
      };
    });

    return {
      accounts,
      categories: categories.map((c) => ({ id: c.id, name: c.name, type: c.type })),
      goals,
      budgets: enrichedBudgets,
      recentTransactions: transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        type: t.type,
        date: t.date,
        categoryName: t.category?.name ?? 'N/A',
        accountName: t.account?.name ?? 'N/A',
      })),
      currentDate: new Date().toISOString().split('T')[0],
    };
  }
}
export default FinancialContextService;
