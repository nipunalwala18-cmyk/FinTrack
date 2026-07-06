import React from 'react';
import { DollarSign, TrendingDown, Wallet, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import type { BudgetDashboardItem } from '../../types/budget';

interface BudgetSummaryProps {
  data: BudgetDashboardItem[];
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ data }) => {
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.actual, 0);
  const remainingBudget = totalBudget - totalSpent;
  const overspentCount = data.filter((item) => item.percentage >= 100).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Budget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Budget</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-650 dark:bg-purple-950/20 dark:text-purple-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1 text-left">
          <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            {formatCurrency(totalBudget)}
          </h3>
          <p className="text-xs text-gray-400 font-medium">All budgeted categories</p>
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Spent</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1 text-left">
          <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            {formatCurrency(totalSpent)}
          </h3>
          <p className="text-xs text-gray-400 font-medium">Actual expenditure</p>
        </div>
      </div>

      {/* 3. Remaining Budget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Remaining</span>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            remainingBudget >= 0 
              ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400' 
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455'
          }`}>
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1 text-left">
          <h3 className={`text-2xl font-black tracking-tight ${remainingBudget >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(remainingBudget)}
          </h3>
          <p className="text-xs text-gray-400 font-medium">Left to spend</p>
        </div>
      </div>

      {/* 4. Overspent Categories */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Overspent Limit</span>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            overspentCount > 0 
              ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 animate-pulse' 
              : 'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400'
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1 text-left">
          <h3 className={`text-2xl font-black tracking-tight ${overspentCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {overspentCount} {overspentCount === 1 ? 'Category' : 'Categories'}
          </h3>
          <p className="text-xs text-gray-400 font-medium">Exceeding 100% threshold</p>
        </div>
      </div>
    </div>
  );
};
export default BudgetSummary;
