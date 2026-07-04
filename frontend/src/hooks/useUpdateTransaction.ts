import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { toast } from 'react-hot-toast';

export const useUpdateTransaction = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionService.updateTransaction(id, data),
    onSuccess: () => {
      toast.success('Transaction updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update transaction';
      toast.error(msg);
    },
  });
};
export default useUpdateTransaction;
