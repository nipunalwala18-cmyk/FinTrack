import type { Category } from './category';

export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  amount: number;
  alertAt?: number | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface BudgetDashboardItem {
  id: string;
  categoryId: string;
  category: string;
  icon?: string;
  color?: string;
  period: BudgetPeriod;
  budget: number;
  actual: number;
  remaining: number;
  percentage: number;
  status: 'ON_TRACK' | 'NEAR_LIMIT' | 'OVER_BUDGET';
  alertTriggered: boolean;
  startDate: string;
  endDate: string;
}

export interface CreateBudgetRequest {
  categoryId: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  amount: number;
  alertAt?: number | null;
}

export interface UpdateBudgetRequest {
  categoryId?: string;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
  amount?: number;
  alertAt?: number | null;
}
