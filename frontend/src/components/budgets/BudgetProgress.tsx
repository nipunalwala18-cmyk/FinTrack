import React from 'react';

interface BudgetProgressProps {
  percentage: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ percentage }) => {
  const cappedPercentage = Math.min(percentage, 100);

  let barColor = '#10b981'; // Green (0-60%)
  if (percentage >= 100) {
    barColor = '#ef4444'; // Red (Over Budget)
  } else if (percentage >= 85) {
    barColor = '#f97316'; // Orange (85-100%)
  } else if (percentage >= 60) {
    barColor = '#f59e0b'; // Yellow/Amber (60-85%)
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${cappedPercentage}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex justify-end">
        <span className="text-[10px] font-semibold text-white/40">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
export default BudgetProgress;
