import React from 'react';
import { formatCurrency } from '../../utils/currency';
import {
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Receipt,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import type { CurrentMonth } from '../../types/dashboard';

interface MonthStatisticsProps {
  stats: CurrentMonth;
}

export const MonthStatistics: React.FC<MonthStatisticsProps> = ({ stats }) => {
  const currentMonthName = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  // Calculate day-of-month for average spending
  const currentDay = new Date().getDate();
  const avgDailySpend = stats.expense > 0 ? Math.round(stats.expense / currentDay) : 0;

  // Calculate net cash flow (Income - Expense)
  const netCashFlow = stats.income - stats.expense;

  return (
    <div
      className="w-full h-full rounded-2xl p-6 flex flex-col justify-between gap-6"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Card Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 shrink-0"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-2 text-left">
          <CalendarDays className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
          <h3 className="text-sm font-semibold" style={{ color: '#fff' }}>
            Current Month Statistics
          </h3>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            ({currentMonthName})
          </span>
        </div>
        {/* Transaction count pill */}
        <div
          className="flex items-center self-start sm:self-center rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <span>{stats.transactionCount} Transactions</span>
        </div>
      </div>

      {/* Flat stat tiles container */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        {/* Row 1: Income, Expense, Savings */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Month Income */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl text-left"
            style={{ background: '#141414' }}
          >
            <ArrowUpRight className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider block"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Income
              </span>
              <p className="text-lg font-semibold" style={{ color: '#fff' }}>
                {formatCurrency(stats.income)}
              </p>
            </div>
          </div>

          {/* Month Expense */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl text-left"
            style={{ background: '#141414' }}
          >
            <ArrowDownRight className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider block"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Expense
              </span>
              <p className="text-lg font-semibold" style={{ color: '#fff' }}>
                {formatCurrency(stats.expense)}
              </p>
            </div>
          </div>

          {/* Month Savings */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl text-left"
            style={{ background: '#141414' }}
          >
            <CircleDollarSign className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider block"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Savings
              </span>
              <p className="text-lg font-semibold" style={{ color: '#fff' }}>
                {formatCurrency(stats.savings)}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Transactions, Avg Spend, Net Cash Flow */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Total Transactions */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl text-left"
            style={{ background: '#141414' }}
          >
            <Receipt className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider block"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Transactions
              </span>
              <p className="text-lg font-semibold" style={{ color: '#fff' }}>
                {stats.transactionCount}
              </p>
            </div>
          </div>

          {/* Avg Daily Spend */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl text-left"
            style={{ background: '#141414' }}
          >
            <TrendingDown className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider block"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Avg Daily Spend
              </span>
              <p className="text-lg font-semibold" style={{ color: '#fff' }}>
                {formatCurrency(avgDailySpend)}
              </p>
            </div>
          </div>

          {/* Net Cash Flow */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl text-left"
            style={{ background: '#141414' }}
          >
            <TrendingUp className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider block"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Net Cash Flow
              </span>
              <p className="text-lg font-semibold" style={{ color: '#fff' }}>
                {formatCurrency(netCashFlow)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
