import React from 'react';

interface BudgetStatusBadgeProps {
  status: 'ON_TRACK' | 'NEAR_LIMIT' | 'OVER_BUDGET';
}

export const BudgetStatusBadge: React.FC<BudgetStatusBadgeProps> = ({ status }) => {
  let badgeStyles = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
  let statusText = 'On Track';

  if (status === 'OVER_BUDGET') {
    badgeStyles = 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
    statusText = 'Over Budget';
  } else if (status === 'NEAR_LIMIT') {
    badgeStyles = 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
    statusText = 'Near Limit';
  }

  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold ${badgeStyles}`}>
      {statusText}
    </span>
  );
};
export default BudgetStatusBadge;
