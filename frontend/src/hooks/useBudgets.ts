import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';
import type { Budget, BudgetDashboardItem, CreateBudgetRequest, UpdateBudgetRequest } from '../types/budget';
import { toast } from 'react-hot-toast';

export const useBudgets = () => {
  return useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: budgetService.getBudgets,
  });
};

export const useBudgetDashboard = (period?: string) => {
  return useQuery<BudgetDashboardItem[]>({
    queryKey: ['budget-dashboard', period],
    queryFn: () => budgetService.getBudgetDashboard(period),
  });
};

export const useCreateBudget = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Budget, Error, CreateBudgetRequest>({
    mutationFn: budgetService.createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-dashboard'] });
      toast.success('Budget created successfully');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to create budget';
      toast.error(msg);
    },
  });
};

export const useUpdateBudget = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Budget, Error, { id: string; data: UpdateBudgetRequest }>({
    mutationFn: ({ id, data }) => budgetService.updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-dashboard'] });
      toast.success('Budget updated successfully');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update budget';
      toast.error(msg);
    },
  });
};

export const useDeleteBudget = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: budgetService.deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-dashboard'] });
      toast.success('Budget deleted successfully');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to delete budget';
      toast.error(msg);
    },
  });
};
