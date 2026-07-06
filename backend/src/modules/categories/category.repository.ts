import { prisma } from '../../config/prisma.js';
import { TransactionType } from '@prisma/client';

export class CategoryRepository {
  public async findAll(userId: string) {
    return prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  public async findById(id: string) {
    return prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        children: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  public async findByNameAndParent(userId: string, name: string, parentId: string | null) {
    return prisma.category.findFirst({
      where: {
        userId,
        parentId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });
  }

  public async create(userId: string, data: {
    name: string;
    type: TransactionType;
    color?: string | null;
    icon?: string | null;
    parentId?: string | null;
    sortOrder?: number;
    isDefault?: boolean;
  }) {
    return prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  public async update(id: string, data: {
    name?: string;
    type?: TransactionType;
    color?: string | null;
    icon?: string | null;
    parentId?: string | null;
    sortOrder?: number;
    isDefault?: boolean;
  }) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string) {
    return prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public async countChildren(id: string) {
    return prisma.category.count({
      where: {
        parentId: id,
        deletedAt: null,
      },
    });
  }

  public async countTransactions(id: string) {
    return prisma.transaction.count({
      where: {
        categoryId: id,
      },
    });
  }

  public async reassignTransactions(fromId: string, toId: string) {
    return prisma.transaction.updateMany({
      where: {
        categoryId: fromId,
      },
      data: {
        categoryId: toId,
      },
    });
  }

  public async updateSortOrders(reorderData: { id: string; sortOrder: number; parentId: string | null }[]) {
    return prisma.$transaction(
      reorderData.map((item) =>
        prisma.category.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
            parentId: item.parentId,
          },
        })
      )
    );
  }
  public async getTransactionSums(userId: string) {
    return prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        categoryId: { not: null },
      },
      _sum: {
        amount: true,
      },
    });
  }
}
export default CategoryRepository;
