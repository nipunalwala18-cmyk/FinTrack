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
    <div
      className="flex p-1 w-full max-w-xs"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
      }}
    >
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className="flex flex-1 items-center justify-center rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: activePeriod === p.value ? '#fff' : 'transparent',
            color: activePeriod === p.value ? '#000' : 'rgba(255,255,255,0.5)',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};
export default BudgetTabs;
