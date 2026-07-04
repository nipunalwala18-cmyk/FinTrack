import React from 'react';
import { formatCurrency } from '../../utils/currency';
import { CalendarDays, ArrowUpRight, ArrowDownRight, CircleDollarSign } from 'lucide-react';
import type { CurrentMonth } from '../../types/dashboard';

interface MonthStatisticsProps {
  stats: CurrentMonth;
}

export const MonthStatistics: React.FC<MonthStatisticsProps> = ({ stats }) => {
  const currentMonthName = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-left">
          <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Current Month Statistics
          </h3>
          <span className="text-xs text-gray-400 font-medium">({currentMonthName})</span>
        </div>
        <div className="flex items-center self-start sm:self-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
          <span>{stats.transactionCount} Transactions</span>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Month Income */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Income</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.income)}
            </p>
          </div>
        </div>

        {/* Month Expense */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/10 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Expense</span>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">
              {formatCurrency(stats.expense)}
            </p>
          </div>
        </div>

        {/* Month Savings */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/[0.03] border border-purple-500/10 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <CircleDollarSign className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Savings</span>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400">
              {formatCurrency(stats.savings)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
