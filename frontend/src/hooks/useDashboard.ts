import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardResponse } from '../types/dashboard';

export const useDashboard = () => {
  return useQuery<DashboardResponse, Error>({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
