import React from 'react';
import type { TransactionType } from '../../types/transaction';

interface TransactionTypeBadgeProps {
  type: TransactionType;
}

export const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case 'INCOME':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'EXPENSE':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
      case 'TRANSFER':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStyles()}`}>
      {type.toLowerCase()}
    </span>
  );
};
export default TransactionTypeBadge;
