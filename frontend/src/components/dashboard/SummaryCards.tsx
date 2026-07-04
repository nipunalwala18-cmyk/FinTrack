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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
      <StatCard
        title="Net Balance"
        value={formatCurrency(summary.netBalance)}
        subtitle="Across all active accounts"
        icon={<Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-50 dark:bg-blue-950/20"
      />
      <StatCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome)}
        subtitle="All-time earnings"
        icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-50 dark:bg-emerald-950/20"
        valueColor="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        title="Total Expense"
        value={formatCurrency(summary.totalExpense)}
        subtitle="All-time spendings"
        icon={<TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
        iconBg="bg-rose-50 dark:bg-rose-950/20"
        valueColor="text-rose-600 dark:text-rose-400"
      />
      <StatCard
        title="Total Savings"
        value={formatCurrency(summary.totalSavings)}
        subtitle="Calculated reserve balance"
        icon={<PiggyBank className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
        iconBg="bg-purple-50 dark:bg-purple-950/20"
        valueColor="text-purple-600 dark:text-purple-400"
      />
    </div>
  );
};
