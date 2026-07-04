import { api } from '../api/axios';
import type { ApiResponse } from '../features/auth/types/auth.types';
import type { DashboardResponse } from '../types/dashboard';

export const dashboardService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get<ApiResponse<DashboardResponse>>('/dashboard');
    return response.data.data;
  },
};
