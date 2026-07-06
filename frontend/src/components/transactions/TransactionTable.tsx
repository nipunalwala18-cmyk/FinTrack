import React from 'react';
import { Eye, Edit, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { TransactionTypeBadge } from './TransactionTypeBadge';
import type { Transaction } from '../../types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  onView: (tx: Transaction) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onView,
  onEdit,
  onDelete,
}) => {
  const getAmountDisplay = (tx: Transaction) => {
    const formatted = formatCurrency(tx.amount);
    if (tx.type === 'INCOME') {
      return <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatted}</span>;
    }
    if (tx.type === 'EXPENSE') {
      return <span className="font-bold text-rose-600 dark:text-rose-400">-{formatted}</span>;
    }
    return <span className="font-bold text-purple-600 dark:text-purple-400">{formatted}</span>;
  };

  return (
    <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-gray-150 bg-white dark:border-gray-800 dark:bg-[#12131a]">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:bg-gray-900/40">
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Account</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="hover:bg-gray-50/40 dark:hover:bg-gray-950/20 transition-colors"
            >
              {/* Date */}
              <td className="px-6 py-4.5 font-medium whitespace-nowrap">
                {new Date(tx.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>

              {/* Description & Notes */}
              <td className="px-6 py-4.5 max-w-[200px] truncate">
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {tx.description || (tx.type === 'TRANSFER' ? 'Transfer' : 'Uncategorized')}
                </p>
                {tx.notes && (
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{tx.notes}</p>
                )}
              </td>

              {/* Category */}
              <td className="px-6 py-4.5 font-semibold">
                {tx.type === 'TRANSFER' ? (
                  <span className="text-xs text-gray-400 font-medium italic">Not Applicable</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {tx.category?.color && (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tx.category.color }}
                      />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">
                      {tx.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                )}
              </td>

              {/* Account Path */}
              <td className="px-6 py-4.5 font-semibold">
                {tx.type === 'TRANSFER' && tx.toAccount ? (
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <span className="truncate max-w-[80px]">{tx.account.name}</span>
                    <ArrowRight className="h-3 w-3 text-purple-400 shrink-0" />
                    <span className="truncate max-w-[80px] text-purple-600 dark:text-purple-400 font-bold">
                      {tx.toAccount.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {tx.account.color && (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tx.account.color }}
                      />
                    )}
                    <span className="text-gray-750 dark:text-gray-300 truncate max-w-[120px]">
                      {tx.account.name}
                    </span>
                  </div>
                )}
              </td>

              {/* Type Badge */}
              <td className="px-6 py-4.5">
                <TransactionTypeBadge type={tx.type} />
              </td>

              {/* Amount */}
              <td className="px-6 py-4.5 text-right whitespace-nowrap">
                {getAmountDisplay(tx)}
              </td>

              {/* Actions dropdown/buttons */}
              <td className="px-6 py-4.5">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onView(tx)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-white transition-all"
                    title="View details"
                  >
                    <Eye className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => onEdit(tx)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-purple-600 dark:hover:bg-gray-900 dark:hover:text-purple-400 transition-all"
                    title="Edit transaction"
                  >
                    <Edit className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => onDelete(tx)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all"
                    title="Delete transaction"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TransactionTable;
