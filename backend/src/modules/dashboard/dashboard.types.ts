export interface DashboardSummary {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
}

export interface CurrentMonthStats {
  income: number;
  expense: number;
  savings: number;
  transactionCount: number;
}

export interface DashboardResponseDto {
  user: {
    name: string;
  };
  summary: DashboardSummary;
  currentMonth: CurrentMonthStats;
}
