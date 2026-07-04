import { PrismaClient, TransactionType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface GetTransactionsFilters {
  userId: string;
  search?: string;
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class TransactionsService {
  async getTransactions(filters: GetTransactionsFilters) {
    const {
      userId,
      search,
      type,
      categoryId,
      accountId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    // Build filter query
    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (accountId) {
      // Matches if the account is either the source or destination
      where.OR = [
        { accountId },
        { toAccountId: accountId },
      ];
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.amount.lte = maxAmount;
      }
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { description: { contains: search, mode: 'insensitive' } },
            { notes: { contains: search, mode: 'insensitive' } },
            { category: { name: { contains: search, mode: 'insensitive' } } },
            { account: { name: { contains: search, mode: 'insensitive' } } },
          ],
        },
      ];
    }

    const order: Prisma.TransactionOrderByWithRelationInput = {};
    if (sortBy === 'amount') {
      order.amount = sortOrder;
    } else {
      order.date = sortOrder;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: order,
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true, color: true, type: true } },
          toAccount: { select: { id: true, name: true, color: true, type: true } },
          category: { select: { id: true, name: true, color: true, icon: true } },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: true,
        toAccount: true,
        category: true,
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  async createTransaction(userId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Transaction
      const transaction = await tx.transaction.create({
        data: {
          amount: data.amount,
          type: data.type,
          description: data.description,
          notes: data.notes,
          date: data.date,
          userId,
          accountId: data.accountId,
          toAccountId: data.toAccountId,
          categoryId: data.categoryId,
        },
      });

      // 2. Adjust account balances
      if (data.type === TransactionType.INCOME) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: data.amount } },
        });
      } else if (data.type === TransactionType.EXPENSE) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { decrement: data.amount } },
        });
      } else if (data.type === TransactionType.TRANSFER) {
        // Source Account (Debit)
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { decrement: data.amount } },
        });
        // Destination Account (Credit)
        await tx.account.update({
          where: { id: data.toAccountId },
          data: { balance: { increment: data.amount } },
        });
      }

      return transaction;
    });
  }

  async updateTransaction(id: string, userId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      const oldTx = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!oldTx) {
        throw new Error('Transaction not found');
      }

      // 1. Revert old account balance changes
      if (oldTx.type === TransactionType.INCOME) {
        await tx.account.update({
          where: { id: oldTx.accountId },
          data: { balance: { decrement: oldTx.amount } },
        });
      } else if (oldTx.type === TransactionType.EXPENSE) {
        await tx.account.update({
          where: { id: oldTx.accountId },
          data: { balance: { increment: oldTx.amount } },
        });
      } else if (oldTx.type === TransactionType.TRANSFER) {
        await tx.account.update({
          where: { id: oldTx.accountId },
          data: { balance: { increment: oldTx.amount } },
        });
        if (oldTx.toAccountId) {
          await tx.account.update({
            where: { id: oldTx.toAccountId },
            data: { balance: { decrement: oldTx.amount } },
          });
        }
      }

      // 2. Apply new values
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          amount: data.amount !== undefined ? data.amount : oldTx.amount,
          type: data.type !== undefined ? data.type : oldTx.type,
          description: data.description !== undefined ? data.description : oldTx.description,
          notes: data.notes !== undefined ? data.notes : oldTx.notes,
          date: data.date !== undefined ? data.date : oldTx.date,
          accountId: data.accountId !== undefined ? data.accountId : oldTx.accountId,
          toAccountId: data.toAccountId !== undefined ? data.toAccountId : oldTx.toAccountId,
          categoryId: data.categoryId !== undefined ? data.categoryId : oldTx.categoryId,
        },
      });

      // 3. Apply new balance changes to accounts
      const activeType = data.type || oldTx.type;
      const activeAmount = data.amount !== undefined ? data.amount : oldTx.amount;
      const activeAccountId = data.accountId || oldTx.accountId;
      const activeToAccountId = data.toAccountId || oldTx.toAccountId;

      if (activeType === TransactionType.INCOME) {
        await tx.account.update({
          where: { id: activeAccountId },
          data: { balance: { increment: activeAmount } },
        });
      } else if (activeType === TransactionType.EXPENSE) {
        await tx.account.update({
          where: { id: activeAccountId },
          data: { balance: { decrement: activeAmount } },
        });
      } else if (activeType === TransactionType.TRANSFER) {
        await tx.account.update({
          where: { id: activeAccountId },
          data: { balance: { decrement: activeAmount } },
        });
        if (activeToAccountId) {
          await tx.account.update({
            where: { id: activeToAccountId },
            data: { balance: { increment: activeAmount } },
          });
        }
      }

      return updatedTransaction;
    });
  }

  async deleteTransaction(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // 1. Revert balance impact from accounts
      if (transaction.type === TransactionType.INCOME) {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { decrement: transaction.amount } },
        });
      } else if (transaction.type === TransactionType.EXPENSE) {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: transaction.amount } },
        });
      } else if (transaction.type === TransactionType.TRANSFER) {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: transaction.amount } },
        });
        if (transaction.toAccountId) {
          await tx.account.update({
            where: { id: transaction.toAccountId },
            data: { balance: { decrement: transaction.amount } },
          });
        }
      }

      // 2. Delete Transaction
      await tx.transaction.delete({
        where: { id },
      });

      return { id };
    });
  }
}
