export interface UserSummary {
  name: string;
}

export interface DashboardSummary {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
}

export interface CurrentMonth {
  income: number;
  expense: number;
  savings: number;
  transactionCount: number;
}

export interface DashboardResponse {
  user: UserSummary;
  summary: DashboardSummary;
  currentMonth: CurrentMonth;
}
