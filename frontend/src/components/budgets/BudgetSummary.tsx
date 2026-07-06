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
      <div
        className="p-5 flex items-center justify-between"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
        }}
      >
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Total Budget</span>
          <p className="text-2xl font-semibold text-white">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white border border-white/10">
          <DollarSign className="h-5 w-5" />
        </div>
      </div>

      {/* 2. Total Spent */}
      <div
        className="p-5 flex items-center justify-between"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
        }}
      >
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Total Spent</span>
          <p className="text-2xl font-semibold text-white">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <TrendingDown className="h-5 w-5" />
        </div>
      </div>

      {/* 3. Remaining Budget */}
      <div
        className="p-5 flex items-center justify-between"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
        }}
      >
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Remaining</span>
          <p className={`text-2xl font-semibold ${remainingBudget >= 0 ? 'text-emerald-400' : 'text-rose-455'}`}>
            {formatCurrency(remainingBudget)}
          </p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          remainingBudget >= 0 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-455 border border-rose-500/20'
        }`}>
          <Wallet className="h-5 w-5" />
        </div>
      </div>

      {/* 4. Overspent Categories */}
      <div
        className="p-5 flex items-center justify-between"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
        }}
      >
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Overspent Limit</span>
          <p className={`text-2xl font-semibold ${overspentCount > 0 ? 'text-rose-455' : 'text-white'}`}>
            {overspentCount} {overspentCount === 1 ? 'Category' : 'Categories'}
          </p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          overspentCount > 0 
            ? 'bg-rose-500/10 text-rose-455 border border-rose-500/20' 
            : 'bg-white/5 text-white/50 border border-white/10'
        }`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
export default BudgetSummary;
