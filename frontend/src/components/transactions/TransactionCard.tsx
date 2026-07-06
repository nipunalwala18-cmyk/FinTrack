import React from 'react';
import { Eye, Edit, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import type { Transaction } from '../../types/transaction';

interface TransactionCardProps {
  transaction: Transaction;
  onView: (tx: Transaction) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction: tx,
  onView,
  onEdit,
  onDelete,
}) => {
  const getAmountDisplay = () => {
    const formatted = formatCurrency(tx.amount);
    if (tx.type === 'INCOME') {
      return <span className="font-black text-emerald-600 dark:text-emerald-450">+{formatted}</span>;
    }
    if (tx.type === 'EXPENSE') {
      return <span className="font-black text-rose-600 dark:text-rose-400">-{formatted}</span>;
    }
    return <span className="font-black text-purple-600 dark:text-purple-400">{formatted}</span>;
  };

  return (
    <div className="md:hidden w-full rounded-2xl border border-gray-150 bg-white p-4 shadow-sm space-y-4 dark:border-gray-800 dark:bg-[#12131a] text-left">
      <div className="flex items-center justify-between">
        {/* Date & Category */}
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {new Date(tx.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
            {tx.description || (tx.type === 'TRANSFER' ? 'Transfer' : 'Uncategorized')}
          </h4>
        </div>

        {/* Amount */}
        <div className="text-right text-base">{getAmountDisplay()}</div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/80 pt-3">
        {/* Account Path */}
        <div className="text-xs font-semibold text-gray-500">
          {tx.type === 'TRANSFER' && tx.toAccount ? (
            <div className="flex items-center gap-1">
              <span className="truncate max-w-[70px]">{tx.account.name}</span>
              <ArrowRight className="h-3 w-3 text-purple-400 shrink-0" />
              <span className="truncate max-w-[70px] text-purple-600 dark:text-purple-400 font-bold">
                {tx.toAccount.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {tx.account.color && (
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: tx.account.color }}
                />
              )}
              <span className="truncate max-w-[100px]">{tx.account.name}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(tx)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onEdit(tx)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-purple-600 dark:hover:bg-gray-900 dark:hover:text-purple-400 transition-colors"
          >
            <Edit className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onDelete(tx)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default TransactionCard;
