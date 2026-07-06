import type { Transaction } from './transaction';

export type GoalType = 'SAVINGS' | 'EXPENSE_LIMIT' | 'INCOME_TARGET';
export type GoalPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'ARCHIVED';

export interface Goal {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  goalType?: GoalType | null;
  period?: GoalPeriod | null;
  targetAmount: number;
  currentAmount: number; // backward compatibility
  savedAmount: number;
  remainingAmount: number;
  progress: number;
  startDate?: string | null;
  endDate?: string | null;
  targetDate: string;
  status: GoalStatus;
  color?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
  lastContributionDate?: string | null;
}

export interface CreateGoalRequest {
  name: string;
  description?: string | null;
  goalType?: GoalType | null;
  period?: GoalPeriod | null;
  targetAmount: number;
  startDate?: string | null;
  endDate?: string | null;
  targetDate: string;
  color?: string | null;
  icon?: string | null;
}

export interface UpdateGoalRequest {
  name?: string;
  description?: string | null;
  goalType?: GoalType | null;
  period?: GoalPeriod | null;
  targetAmount?: number;
  startDate?: string | null;
  endDate?: string | null;
  targetDate?: string;
  color?: string | null;
  icon?: string | null;
}
