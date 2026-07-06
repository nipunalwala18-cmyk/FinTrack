import { prisma } from '../../config/prisma.js';
import { BudgetPeriod } from '@prisma/client';

export class BudgetRepository {
  public async findAll(userId: string) {
    return prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findById(id: string) {
    return prisma.budget.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  public async findOverlappingBudget(
    userId: string,
    categoryId: string,
    period: BudgetPeriod,
    startDate: Date,
    endDate: Date,
    excludeId?: string
  ) {
    return prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        period,
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });
  }

  public async create(userId: string, data: {
    categoryId: string;
    period: BudgetPeriod;
    startDate: Date;
    endDate: Date;
    amount: number;
    alertAt?: number | null;
  }) {
    return prisma.budget.create({
      data: {
        ...data,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  public async update(id: string, data: {
    categoryId?: string;
    period?: BudgetPeriod;
    startDate?: Date;
    endDate?: Date;
    amount?: number;
    alertAt?: number | null;
  }) {
    return prisma.budget.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  public async delete(id: string) {
    return prisma.budget.delete({
      where: { id },
    });
  }

  public async getCategorySpentSum(userId: string, categoryId: string, startDate: Date, endDate: Date) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { children: { where: { deletedAt: null } } },
    });

    if (!category) return 0;

    const categoryIds = [categoryId];
    if (category.children && category.children.length > 0) {
      category.children.forEach((c) => categoryIds.push(c.id));
    }

    const result = await prisma.transaction.aggregate({
      where: {
        userId,
        categoryId: { in: categoryIds },
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ?? 0;
  }
}
export default BudgetRepository;
