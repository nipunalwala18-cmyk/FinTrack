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
      return <span className="font-semibold text-emerald-400">+{formatted}</span>;
    }
    if (tx.type === 'EXPENSE') {
      return <span className="font-semibold text-rose-400">-{formatted}</span>;
    }
    return <span className="font-semibold text-white/70">{formatted}</span>;
  };

  // Maps core categories to specific colored dots for dashboard-style alignment
  const getCategoryDotColor = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('invest')) return '#3b82f6'; // Blue
    if (norm.includes('food') || norm.includes('dining')) return '#f97316'; // Orange
    if (norm.includes('shop')) return '#ec4899'; // Pink
    if (norm.includes('bill') || norm.includes('utility')) return '#a855f7'; // Purple
    if (norm.includes('salary') || norm.includes('income')) return '#22c55e'; // Green
    return '#6b7280'; // Muted Gray
  };

  return (
    <div
      className="hidden md:block w-full overflow-hidden"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
      }}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                borderBottom: '0.5px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <th className="px-6 py-4.5 font-semibold text-white/50">Date</th>
              <th className="px-6 py-4.5 font-semibold text-white/50">Description</th>
              <th className="px-6 py-4.5 font-semibold text-white/50">Category</th>
              <th className="px-6 py-4.5 font-semibold text-white/50">Account</th>
              <th className="px-6 py-4.5 font-semibold text-white/50">Type</th>
              <th className="px-6 py-4.5 font-semibold text-white/50 text-right">Amount</th>
              <th className="px-6 py-4.5 font-semibold text-white/50 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                {/* Date */}
                <td className="px-6 py-4 font-normal text-white/90 whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>

                {/* Description & Notes */}
                <td className="px-6 py-4 max-w-[200px] truncate">
                  <p className="font-semibold text-white truncate">
                    {tx.description || (tx.type === 'TRANSFER' ? 'Transfer' : 'Uncategorized')}
                  </p>
                  {tx.notes && (
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{tx.notes}</p>
                  )}
                </td>

                {/* Category */}
                <td className="px-6 py-4 font-normal text-white/80">
                  {tx.type === 'TRANSFER' ? (
                    <span className="text-xs font-normal italic" style={{ color: 'rgba(255,255,255,0.4)' }}>Not Applicable</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: getCategoryDotColor(tx.category?.name || '') }}
                      />
                      <span>
                        {tx.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  )}
                </td>

                {/* Account Path */}
                <td className="px-6 py-4 font-normal text-white/85">
                  {tx.type === 'TRANSFER' && tx.toAccount ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="truncate max-w-[80px]">{tx.account.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/40 shrink-0" />
                      <span className="truncate max-w-[80px] font-semibold text-white">
                        {tx.toAccount.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: '#fff' }}
                      />
                      <span className="truncate max-w-[120px]">
                        {tx.account.name}
                      </span>
                    </div>
                  )}
                </td>

                {/* Type Badge */}
                <td className="px-6 py-4">
                  <TransactionTypeBadge type={tx.type} />
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {getAmountDisplay(tx)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onView(tx)}
                      className="rounded-lg p-1.5 text-white/45 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
                      title="View details"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => onEdit(tx)}
                      className="rounded-lg p-1.5 text-white/45 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
                      title="Edit transaction"
                    >
                      <Edit className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="rounded-lg p-1.5 text-white/45 hover:bg-rose-500/10 hover:text-rose-450 transition-all active:scale-95 cursor-pointer"
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
    </div>
  );
};
export default TransactionTable;
