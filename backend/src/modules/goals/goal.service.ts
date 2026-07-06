import { GoalRepository } from './goal.repository.js';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { GoalType, GoalPeriod, GoalStatus } from '@prisma/client';

const goalRepository = new GoalRepository();

export class GoalService {
  public async getGoals(userId: string) {
    const goals = await goalRepository.findAll(userId);
    // Map each goal to include dynamic contribution calculations
    return Promise.all(goals.map((g) => this.getRichGoalData(g)));
  }

  public async getGoalById(id: string, userId: string) {
    const goal = await goalRepository.findById(id);
    if (!goal || goal.userId !== userId) {
      throw new AppError('Goal not found', 404);
    }
    return this.getRichGoalData(goal);
  }

  public async createGoal(
    userId: string,
    data: {
      name: string;
      description?: string | null;
      goalType?: GoalType | null;
      period?: GoalPeriod | null;
      targetAmount: number;
      startDate?: Date | null;
      endDate?: Date | null;
      targetDate: Date;
      color?: string | null;
      icon?: string | null;
    }
  ) {
    const goal = await goalRepository.create(userId, {
      ...data,
      status: GoalStatus.ACTIVE,
      currentAmount: 0,
    });

    return this.getRichGoalData(goal);
  }

  public async updateGoal(
    userId: string,
    id: string,
    data: {
      name?: string;
      description?: string | null;
      goalType?: GoalType | null;
      period?: GoalPeriod | null;
      targetAmount?: number;
      startDate?: Date | null;
      endDate?: Date | null;
      targetDate?: Date | null;
      color?: string | null;
      icon?: string | null;
    }
  ) {
    const goal = await goalRepository.findById(id);
    if (!goal || goal.userId !== userId) {
      throw new AppError('Goal not found', 404);
    }

    const updated = await goalRepository.update(id, data as any);
    return this.getRichGoalData(updated);
  }

  public async deleteGoal(userId: string, id: string) {
    const goal = await goalRepository.findById(id);
    if (!goal || goal.userId !== userId) {
      throw new AppError('Goal not found', 404);
    }
    return goalRepository.delete(id);
  }

  public async updateGoalStatus(userId: string, id: string, status: GoalStatus) {
    const goal = await goalRepository.findById(id);
    if (!goal || goal.userId !== userId) {
      throw new AppError('Goal not found', 404);
    }
    const updated = await goalRepository.updateStatus(id, status);
    return this.getRichGoalData(updated);
  }

  /**
   * Recalculates all goals for a user
   */
  public async recalculateUserGoals(userId: string): Promise<void> {
    const goals = await prisma.goal.findMany({
      where: { userId },
    });

    for (const goal of goals) {
      await this.getRichGoalData(goal);
    }
  }

  /**
   * Calculates rich goal metadata (saved amount, progress, remaining) based on contribution transactions
   */
  private async getRichGoalData(goal: any) {
    // Fetch all transactions linked to this goal
    const transactions = await prisma.transaction.findMany({
      where: { goalId: goal.id },
      orderBy: { date: 'desc' },
      include: {
        account: { select: { id: true, name: true, color: true } },
      },
    });

    // savedAmount = Sum(Deposits) - Sum(Withdrawals)
    const deposits = transactions
      .filter((t) => t.contributionType === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawals = transactions
      .filter((t) => t.contributionType === 'WITHDRAWAL')
      .reduce((sum, t) => sum + t.amount, 0);

    const savedAmount = deposits - withdrawals;
    const remainingAmount = Math.max(0, goal.targetAmount - savedAmount);
    
    const progressPercentage = goal.targetAmount > 0 ? (savedAmount / goal.targetAmount) * 100 : 0;
    const progress = Math.min(100, Math.max(0, Math.round(progressPercentage)));

    // Last contribution date (most recent DEPOSIT transaction date)
    const lastDeposit = transactions.find((t) => t.contributionType === 'DEPOSIT');
    const lastContributionDate = lastDeposit ? lastDeposit.date : null;

    // Check status update if not cancelled or archived
    let status = goal.status;
    if (status !== 'CANCELLED' && status !== 'ARCHIVED') {
      const targetDateVal = goal.targetDate || goal.endDate;
      if (progress >= 100) {
        status = GoalStatus.COMPLETED;
      } else if (targetDateVal && new Date() > new Date(targetDateVal)) {
        status = GoalStatus.FAILED;
      } else {
        status = GoalStatus.ACTIVE;
      }
    }

    // Sync database values if changed
    if (goal.currentAmount !== savedAmount || goal.status !== status) {
      await prisma.goal.update({
        where: { id: goal.id },
        data: {
          currentAmount: savedAmount,
          status,
        },
      });
    }

    return {
      ...goal,
      currentAmount: savedAmount, // backward compatibility
      savedAmount,
      remainingAmount,
      progress,
      status,
      lastContributionDate,
      transactions,
    };
  }
}

export default GoalService;
