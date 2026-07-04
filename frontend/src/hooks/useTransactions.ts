import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';

export const useTransactions = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters),
  });
};
export default useTransactions;
