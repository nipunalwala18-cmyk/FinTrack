import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: TransactionType.INCOME, color: '#10B981', icon: 'briefcase' },
  { name: 'Freelance', type: TransactionType.INCOME, color: '#34D399', icon: 'laptop' },
  { name: 'Investments', type: TransactionType.INCOME, color: '#60A5FA', icon: 'trending-up' },
  { name: 'Food & Dining', type: TransactionType.EXPENSE, color: '#F87171', icon: 'utensils' },
  { name: 'Shopping', type: TransactionType.EXPENSE, color: '#F472B6', icon: 'shopping-bag' },
  { name: 'Travel & Transport', type: TransactionType.EXPENSE, color: '#FBBF24', icon: 'car' },
  { name: 'Rent & Housing', type: TransactionType.EXPENSE, color: '#FB7185', icon: 'home' },
  { name: 'Utilities', type: TransactionType.EXPENSE, color: '#A78BFA', icon: 'zap' },
  { name: 'Entertainment', type: TransactionType.EXPENSE, color: '#EC4899', icon: 'tv' },
];

export class CategoriesService {
  async getCategories(userId: string) {
    // 1. Fetch user's categories from DB
    let categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId },
          { userId: null }, // System defaults
        ],
      },
      orderBy: { name: 'asc' },
    });

    // 2. If no categories exist, auto-seed defaults for this user
    const hasUserCategories = categories.some((c) => c.userId === userId);
    if (!hasUserCategories && categories.length === 0) {
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map((c) => ({
          ...c,
          userId,
        })),
      });

      categories = await prisma.category.findMany({
        where: {
          OR: [{ userId }, { userId: null }],
        },
        orderBy: { name: 'asc' },
      });
    }

    return categories;
  }

  async createCategory(userId: string, data: { name: string; type: TransactionType; color?: string; icon?: string }) {
    return prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
        userId,
      },
    });
  }
}
