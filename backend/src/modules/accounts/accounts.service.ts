import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { AccountType } from '@prisma/client';

export class AccountsService {
  public async createAccount(userId: string, data: any) {
    // 1. Duplicate name check
    const existing = await prisma.account.findFirst({
      where: {
        userId,
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      throw new AppError('An account with this name already exists', 400);
    }

    // 2. Create account
    return prisma.account.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  public async getAccounts(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }
}
export default AccountsService;
