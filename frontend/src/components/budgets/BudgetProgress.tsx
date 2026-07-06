import React from 'react';

interface BudgetProgressProps {
  percentage: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ percentage }) => {
  const cappedPercentage = Math.min(percentage, 100);

  let barColor = 'bg-emerald-500';
  if (percentage >= 100) {
    barColor = 'bg-rose-500';
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500';
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="h-2.5 w-full rounded-full bg-gray-150 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${cappedPercentage}%` }}
        />
      </div>
      <div className="flex justify-end">
        <span className="text-xs font-black text-gray-500 dark:text-gray-400">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
export default BudgetProgress;
