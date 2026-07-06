import React from 'react';
import type { TransactionType } from '../../types/transaction';

interface TransactionTypeBadgeProps {
  type: TransactionType;
}

export const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case 'INCOME':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'EXPENSE':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'TRANSFER':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-white/5 text-white/50 border border-white/10';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider ${getStyles()}`}
    >
      {type.toLowerCase()}
    </span>
  );
};
export default TransactionTypeBadge;
