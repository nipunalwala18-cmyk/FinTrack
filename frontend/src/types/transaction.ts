export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface AccountShort {
  id: string;
  name: string;
  color?: string;
  type: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  accountId: string;
  account: AccountShort;
  toAccountId?: string;
  toAccount?: AccountShort;
  categoryId?: string;
  category?: Category;
  goalId?: string | null;
  contributionType?: 'DEPOSIT' | 'WITHDRAWAL' | null;
  goal?: { id: string; name: string } | null;
}

export interface GetTransactionsResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
