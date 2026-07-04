import { api } from '../api/axios';
import type { ApiResponse } from '../features/auth/types/auth.types';
import type { CreateAccountRequest, Account } from '../types/account';

export const accountService = {
  createAccount: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post<ApiResponse<Account>>('/accounts', data);
    return response.data.data;
  },
  getAccounts: async (): Promise<Account[]> => {
    const response = await api.get<ApiResponse<Account[]>>('/accounts');
    return response.data.data;
  },
};
export default accountService;
