import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../services/goal.service';
import type { Goal, CreateGoalRequest, UpdateGoalRequest, GoalStatus } from '../types/goal';
import { toast } from 'react-hot-toast';

export const useGoals = () => {
  return useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: goalService.getGoals,
  });
};

export const useCreateGoal = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Goal, Error, CreateGoalRequest>({
    mutationFn: goalService.createGoal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Goal "${data.name}" created successfully`);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to create goal';
      toast.error(msg);
    },
  });
};

export const useUpdateGoal = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Goal, Error, { id: string; data: UpdateGoalRequest }>({
    mutationFn: ({ id, data }) => goalService.updateGoal(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Goal "${data.name}" updated successfully`);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update goal';
      toast.error(msg);
    },
  });
};

export const useDeleteGoal = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: goalService.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Goal deleted successfully');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to delete goal';
      toast.error(msg);
    },
  });
};

export const useUpdateGoalStatus = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Goal, Error, { id: string; status: GoalStatus }>({
    mutationFn: ({ id, status }) => goalService.updateGoalStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Goal status updated to ${data.status}`);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update goal status';
      toast.error(msg);
    },
  });
};
