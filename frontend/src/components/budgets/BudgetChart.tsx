import React from 'react';
import { formatCurrency } from '../../utils/currency';
import type { BudgetDashboardItem } from '../../types/budget';

interface BudgetChartProps {
  data: BudgetDashboardItem[];
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.actual, 0);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Widget 3 SVG Gauge calculations
  const r = 50;
  const circ = 2 * Math.PI * r;
  const strokeDashoffset = circ - (Math.min(overallPercentage, 100) / 100) * circ;

  let gaugeColor = 'stroke-emerald-500';
  if (overallPercentage >= 100) {
    gaugeColor = 'stroke-rose-500';
  } else if (overallPercentage >= 80) {
    gaugeColor = 'stroke-amber-500';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* 1. Overall Budget Utilization Gauge */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between items-center text-center space-y-4">
        <div className="w-full text-left">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
            Overall Utilization
          </span>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">Status Dial</h3>
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center h-44 w-44">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background track circle */}
            <circle
              cx="60"
              cy="60"
              r={r}
              className="stroke-gray-100 dark:stroke-gray-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Foreground progress circle */}
            <circle
              cx="60"
              cy="60"
              r={r}
              className={`transition-all duration-700 ease-out ${gaugeColor}`}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {overallPercentage}%
            </span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
              Utilized
            </span>
          </div>
        </div>

        <div className="w-full border-t border-gray-50 dark:border-gray-800/80 pt-3 flex justify-around text-xs">
          <div>
            <span className="text-gray-400 block mb-0.5">Total Allocated</span>
            <span className="font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="border-l border-gray-100 dark:border-gray-800" />
          <div>
            <span className="text-gray-400 block mb-0.5">Total Spending</span>
            <span className="font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Budget vs Actual Comparison */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between lg:col-span-2 space-y-4 text-left">
        <div>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
            Comparison
          </span>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">Budget vs Actual Spent</h3>
        </div>

        {/* Categories Grouped Comparison bars */}
        <div className="space-y-4 overflow-y-auto max-h-56 pr-1">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              No budget comparison data available.
            </div>
          ) : (
            data.map((item) => {
              const maxVal = Math.max(item.budget, item.actual);
              const budgetWidth = maxVal > 0 ? (item.budget / maxVal) * 100 : 0;
              const actualWidth = maxVal > 0 ? (item.actual / maxVal) * 100 : 0;

              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                      {item.category}
                    </span>
                    <span className="text-gray-400 font-medium">
                      {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                    </span>
                  </div>

                  <div className="space-y-1 bg-gray-50 dark:bg-gray-900/40 p-1.5 rounded-xl border border-gray-100/50 dark:border-gray-850">
                    {/* Budget limit Bar (Purple) */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-gray-400 w-10 shrink-0">Budget</span>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-500/80 dark:bg-purple-500/70 transition-all duration-500"
                          style={{ width: `${budgetWidth}%` }}
                        />
                      </div>
                    </div>

                    {/* Actual spent Bar (Green/Red) */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-gray-400 w-10 shrink-0">Actual</span>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.actual >= item.budget ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${actualWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default BudgetChart;
