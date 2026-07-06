import { api } from '../api/axios';
import type { Goal, CreateGoalRequest, UpdateGoalRequest, GoalStatus } from '../types/goal';

export const goalService = {
  getGoals: async (): Promise<Goal[]> => {
    const response = await api.get<{ success: boolean; data: Goal[] }>('/goals');
    return response.data.data;
  },

  getGoalById: async (id: string): Promise<Goal> => {
    const response = await api.get<{ success: boolean; data: Goal }>(`/goals/${id}`);
    return response.data.data;
  },

  createGoal: async (data: CreateGoalRequest): Promise<Goal> => {
    const response = await api.post<{ success: boolean; data: Goal }>('/goals', data);
    return response.data.data;
  },

  updateGoal: async (id: string, data: UpdateGoalRequest): Promise<Goal> => {
    const response = await api.put<{ success: boolean; data: Goal }>(`/goals/${id}`, data);
    return response.data.data;
  },

  deleteGoal: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/goals/${id}`);
    return response.data;
  },

  updateGoalStatus: async (id: string, status: GoalStatus): Promise<Goal> => {
    const response = await api.patch<{ success: boolean; data: Goal }>(`/goals/${id}/status`, { status });
    return response.data.data;
  },
};

export default goalService;
