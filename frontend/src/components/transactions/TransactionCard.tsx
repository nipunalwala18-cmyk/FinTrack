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
      return <span className="font-semibold text-emerald-400">+{formatted}</span>;
    }
    if (tx.type === 'EXPENSE') {
      return <span className="font-semibold text-rose-400">-{formatted}</span>;
    }
    return <span className="font-semibold text-white/70">{formatted}</span>;
  };

  return (
    <div
      className="md:hidden w-full p-4 space-y-4 text-left"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Date & Category */}
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {new Date(tx.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <h4 className="text-sm font-semibold text-white truncate max-w-[150px]">
            {tx.description || (tx.type === 'TRANSFER' ? 'Transfer' : 'Uncategorized')}
          </h4>
        </div>

        {/* Amount */}
        <div className="text-right text-sm">{getAmountDisplay()}</div>
      </div>

      <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* Account Path */}
        <div className="text-xs text-white/50">
          {tx.type === 'TRANSFER' && tx.toAccount ? (
            <div className="flex items-center gap-1">
              <span className="truncate max-w-[70px]">{tx.account.name}</span>
              <ArrowRight className="h-3 w-3 text-white/40 shrink-0" />
              <span className="truncate max-w-[70px] font-semibold text-white">
                {tx.toAccount.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: '#fff' }}
              />
              <span className="truncate max-w-[100px]">{tx.account.name}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(tx)}
            className="rounded-lg p-1.5 text-white/45 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onEdit(tx)}
            className="rounded-lg p-1.5 text-white/45 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Edit className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onDelete(tx)}
            className="rounded-lg p-1.5 text-white/45 hover:bg-rose-500/10 hover:text-rose-455 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default TransactionCard;
