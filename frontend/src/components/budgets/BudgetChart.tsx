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

  let strokeColor = '#10b981'; // Green
  if (overallPercentage >= 100) {
    strokeColor = '#ef4444'; // Red
  } else if (overallPercentage >= 85) {
    strokeColor = '#f97316'; // Orange
  } else if (overallPercentage >= 60) {
    strokeColor = '#f59e0b'; // Yellow/Amber
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* 1. Overall Budget Utilization Gauge */}
      <div
        className="p-6 flex flex-col justify-between items-center text-center space-y-4"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
        }}
      >
        <div className="w-full text-left">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
            Overall Utilization
          </span>
          <h3 className="text-base font-bold text-white mt-1">Status Dial</h3>
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center h-44 w-44">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background track circle */}
            <circle
              cx="60"
              cy="60"
              r={r}
              className="stroke-white/5"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Foreground progress circle */}
            <circle
              cx="60"
              cy="60"
              r={r}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.7s ease-out',
                stroke: strokeColor,
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-semibold text-white tracking-tight">
              {overallPercentage}%
            </span>
            <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider mt-0.5">
              Utilized
            </span>
          </div>
        </div>

        <div className="w-full border-t pt-3 flex justify-around text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="text-center">
            <span className="text-white/40 block mb-0.5 text-[9px] font-semibold uppercase tracking-wider">Total Allocated</span>
            <span className="font-semibold text-white">
              {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="border-l" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <div className="text-center">
            <span className="text-white/40 block mb-0.5 text-[9px] font-semibold uppercase tracking-wider">Total Spending</span>
            <span className="font-semibold text-white">
              {formatCurrency(totalSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Budget vs Actual Comparison */}
      <div
        className="p-6 flex flex-col justify-between lg:col-span-2 space-y-4 text-left"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
        }}
      >
        <div>
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
            Comparison
          </span>
          <h3 className="text-base font-bold text-white mt-1">Budget vs Actual Spent</h3>
        </div>

        {/* Categories Grouped Comparison bars */}
        <div className="space-y-4 overflow-y-auto max-h-56 pr-1 scrollbar-hidden">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-white/40 font-semibold uppercase tracking-wider">
              No comparison metrics.
            </div>
          ) : (
            data.map((item) => {
              const maxVal = Math.max(item.budget, item.actual);
              const budgetWidth = maxVal > 0 ? (item.budget / maxVal) * 100 : 0;
              const actualWidth = maxVal > 0 ? (item.actual / maxVal) * 100 : 0;

              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white/80 truncate max-w-[200px]">
                      {item.category}
                    </span>
                    <span className="text-white/40 font-medium text-[11px]">
                      {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                    </span>
                  </div>

                  <div
                    className="space-y-1.5 p-3 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {/* Budget limit Bar (White opacity overlay) */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-white/40 w-10 shrink-0 uppercase tracking-wider">Budget</span>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/35 transition-all duration-500"
                          style={{ width: `${budgetWidth}%` }}
                        />
                      </div>
                    </div>

                    {/* Actual spent Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-white/40 w-10 shrink-0 uppercase tracking-wider">Actual</span>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${actualWidth}%`,
                            backgroundColor: item.actual >= item.budget ? '#ef4444' : '#10b981',
                          }}
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
