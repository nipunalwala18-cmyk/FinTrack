import React from 'react';

interface BudgetStatusBadgeProps {
  status: 'ON_TRACK' | 'NEAR_LIMIT' | 'OVER_BUDGET';
}

export const BudgetStatusBadge: React.FC<BudgetStatusBadgeProps> = ({ status }) => {
  let badgeStyles = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  let statusText = 'On Track';

  if (status === 'OVER_BUDGET') {
    badgeStyles = 'bg-rose-500/10 text-rose-455 border border-rose-500/20';
    statusText = 'Over Budget';
  } else if (status === 'NEAR_LIMIT') {
    badgeStyles = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    statusText = 'Near Limit';
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeStyles}`}>
      {statusText}
    </span>
  );
};
export default BudgetStatusBadge;
