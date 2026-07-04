import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { CreateAccountRequest, Account } from '../types/account';
import { toast } from 'react-hot-toast';

export const useCreateAccount = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Account, Error, CreateAccountRequest>({
    mutationFn: accountService.createAccount,
    onSuccess: () => {
      // Invalidate queries to refresh dashboard and accounts statistics
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      
      toast.success('Account created successfully.');
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to create account.';
      toast.error(message);
    },
  });
};
