import { api } from '../api/axios';
import type { Budget, BudgetDashboardItem, CreateBudgetRequest, UpdateBudgetRequest } from '../types/budget';

export const budgetService = {
  getBudgets: async (): Promise<Budget[]> => {
    const response = await api.get<{ success: boolean; data: Budget[] }>('/budgets');
    return response.data.data;
  },

  getBudgetById: async (id: string): Promise<Budget> => {
    const response = await api.get<{ success: boolean; data: Budget }>(`/budgets/${id}`);
    return response.data.data;
  },

  createBudget: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await api.post<{ success: boolean; data: Budget }>('/budgets', data);
    return response.data.data;
  },

  updateBudget: async (id: string, data: UpdateBudgetRequest): Promise<Budget> => {
    const response = await api.put<{ success: boolean; data: Budget }>(`/budgets/${id}`, data);
    return response.data.data;
  },

  deleteBudget: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/budgets/${id}`);
    return response.data;
  },

  getBudgetDashboard: async (period?: string): Promise<BudgetDashboardItem[]> => {
    const response = await api.get<{ success: boolean; data: BudgetDashboardItem[] }>('/budgets/dashboard', {
      params: { period },
    });
    return response.data.data;
  },
};

export default budgetService;
