import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { DashboardResponseDto } from './dashboard.types.js';
import { TransactionType } from '@prisma/client';

export class DashboardService {
  public async getDashboardData(userId: string): Promise<DashboardResponseDto> {
    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // 2. Determine current month boundaries (local time basis)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // 3. Execute queries concurrently using Promise.all
    const [
      netBalanceResult,
      totalIncomeResult,
      totalExpenseResult,
      monthIncomeResult,
      monthExpenseResult,
      monthTxCount,
    ] = await Promise.all([
      // Net Balance: SUM(balance) of all user accounts
      prisma.account.aggregate({
        where: { userId, isArchived: false },
        _sum: { balance: true },
      }),
      // Total Income: SUM(amount) where type = INCOME
      prisma.transaction.aggregate({
        where: { userId, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      // Total Expense: SUM(amount) where type = EXPENSE
      prisma.transaction.aggregate({
        where: { userId, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
      // Current Month Income: SUM(amount) where type = INCOME and date is in current month
      prisma.transaction.aggregate({
        where: {
          userId,
          type: TransactionType.INCOME,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      // Current Month Expense: SUM(amount) where type = EXPENSE and date is in current month
      prisma.transaction.aggregate({
        where: {
          userId,
          type: TransactionType.EXPENSE,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      // Current Month Transaction Count: COUNT(*) where date is in current month
      prisma.transaction.count({
        where: {
          userId,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
    ]);

    // 4. Safely convert null aggregates to zero
    const netBalance = netBalanceResult._sum.balance ?? 0;
    const totalIncome = totalIncomeResult._sum.amount ?? 0;
    const totalExpense = totalExpenseResult._sum.amount ?? 0;
    const totalSavings = totalIncome - totalExpense;

    const currentMonthIncome = monthIncomeResult._sum.amount ?? 0;
    const currentMonthExpense = monthExpenseResult._sum.amount ?? 0;
    const currentMonthSavings = currentMonthIncome - currentMonthExpense;

    return {
      user: {
        name: user.fullName,
      },
      summary: {
        netBalance,
        totalIncome,
        totalExpense,
        totalSavings,
      },
      currentMonth: {
        income: currentMonthIncome,
        expense: currentMonthExpense,
        savings: currentMonthSavings,
        transactionCount: monthTxCount,
      },
    };
  }
}
export default DashboardService;
