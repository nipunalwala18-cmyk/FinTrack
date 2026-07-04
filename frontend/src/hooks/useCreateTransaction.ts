import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { toast } from 'react-hot-toast';

export const useCreateTransaction = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => transactionService.createTransaction(data),
    onSuccess: () => {
      toast.success('Transaction added successfully!');
      // Invalidate dashboard, transactions, accounts keys immediately
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to add transaction';
      toast.error(msg);
    },
  });
};
export default useCreateTransaction;
