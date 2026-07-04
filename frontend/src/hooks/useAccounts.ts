import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { Account } from '../types/account';

export const useAccounts = () => {
  return useQuery<Account[], Error>({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
    refetchOnWindowFocus: true,
  });
};
