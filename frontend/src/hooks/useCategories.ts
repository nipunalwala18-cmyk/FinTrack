import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => transactionService.getCategories(),
  });
};
export default useCategories;
