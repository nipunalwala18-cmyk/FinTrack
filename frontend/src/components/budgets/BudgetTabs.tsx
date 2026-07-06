import React from 'react';
import type { BudgetPeriod } from '../../types/budget';

interface BudgetTabsProps {
  activePeriod: BudgetPeriod;
  onChange: (period: BudgetPeriod) => void;
}

export const BudgetTabs: React.FC<BudgetTabsProps> = ({ activePeriod, onChange }) => {
  const periods: { value: BudgetPeriod; label: string }[] = [
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' },
  ];

  return (
    <div className="flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-900 w-full max-w-sm">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`flex flex-1 items-center justify-center rounded-xl py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activePeriod === p.value
              ? 'bg-white text-gray-900 shadow-xs dark:bg-[#1c1d24] dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};
export default BudgetTabs;
