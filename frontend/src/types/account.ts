export type AccountType = 'BANK' | 'CASH' | 'CREDIT_CARD' | 'INVESTMENT' | 'E_WALLET';

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  
  // Extended fields
  accountNumber?: string | null;
  branch?: string | null;
  
  creditLimit?: number | null;
  outstandingBalance?: number | null;
  billingDay?: number | null;
  paymentDueDay?: number | null;
  
  provider?: string | null;
  
  interestRate?: number | null;
  investmentDuration?: number | null;
  
  notes?: string | null;
  includeInNetWorth?: boolean;
  displayOrder?: number | null;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: AccountType;
  color?: string;
  icon?: string;
  isArchived: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  
  // Extended fields
  accountNumber?: string | null;
  branch?: string | null;
  
  creditLimit?: number | null;
  outstandingBalance?: number | null;
  billingDay?: number | null;
  paymentDueDay?: number | null;
  
  provider?: string | null;
  
  interestRate?: number | null;
  investmentDuration?: number | null;
  
  notes?: string | null;
  includeInNetWorth?: boolean;
  displayOrder?: number | null;
}
