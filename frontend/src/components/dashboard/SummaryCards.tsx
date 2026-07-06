import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { StatCard } from './StatCard';
import { formatCurrency } from '../../utils/currency';
import type { DashboardSummary } from '../../types/dashboard';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
      <StatCard
        title="Net Balance"
        value={formatCurrency(summary.netBalance)}
        subtitle="Across all active accounts"
        icon={<Wallet className="h-4 w-4" />}
      />
      <StatCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome)}
        subtitle="All-time earnings"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <StatCard
        title="Total Expense"
        value={formatCurrency(summary.totalExpense)}
        subtitle="All-time spendings"
        icon={<TrendingDown className="h-4 w-4" />}
      />
      <StatCard
        title="Total Savings"
        value={formatCurrency(summary.totalSavings)}
        subtitle="Calculated reserve balance"
        icon={<PiggyBank className="h-4 w-4" />}
      />
    </div>
  );
};
