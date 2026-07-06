import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { toast } from 'react-hot-toast';

export const useDeleteTransaction = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      toast.success('Transaction deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['budget-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to delete transaction';
      toast.error(msg);
    },
  });
};
export default useDeleteTransaction;
