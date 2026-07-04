import { api } from '../api/axios';
import type { GetTransactionsResponse, Transaction, Category } from '../types/transaction';

export const transactionService = {
  async getTransactions(filters: Record<string, any>): Promise<GetTransactionsResponse> {
    const response = await api.get<{ success: boolean; data: GetTransactionsResponse }>('/transactions', {
      params: filters,
    });
    return response.data.data;
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<{ success: boolean; data: Transaction }>(`/transactions/${id}`);
    return response.data.data;
  },

  async createTransaction(data: any): Promise<Transaction> {
    const response = await api.post<{ success: boolean; data: Transaction }>('/transactions', data);
    return response.data.data;
  },

  async updateTransaction(id: string, data: any): Promise<Transaction> {
    const response = await api.put<{ success: boolean; data: Transaction }>(`/transactions/${id}`, data);
    return response.data.data;
  },

  async deleteTransaction(id: string): Promise<{ id: string }> {
    const response = await api.delete<{ success: boolean; data: { id: string } }>(`/transactions/${id}`);
    return response.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data;
  },
};
export default transactionService;
