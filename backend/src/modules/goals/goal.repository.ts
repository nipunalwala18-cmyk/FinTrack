import { prisma } from '../../config/prisma.js';
import { GoalType, GoalPeriod, GoalStatus } from '@prisma/client';

export class GoalRepository {
  public async findAll(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findById(id: string) {
    return prisma.goal.findUnique({
      where: { id },
    });
  }

  public async create(
    userId: string,
    data: any
  ) {
    return prisma.goal.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  public async update(
    id: string,
    data: any
  ) {
    return prisma.goal.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string) {
    return prisma.goal.delete({
      where: { id },
    });
  }

  public async updateStatus(id: string, status: GoalStatus) {
    return prisma.goal.update({
      where: { id },
      data: { status },
    });
  }

  public async findActiveGoalsByDateRange(userId: string, date: Date) {
    return prisma.goal.findMany({
      where: {
        userId,
        startDate: { lte: date },
        endDate: { gte: date },
      },
    });
  }
}

export default GoalRepository;
