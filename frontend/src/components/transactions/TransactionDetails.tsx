import React, { useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/currency';
import { TransactionTypeBadge } from './TransactionTypeBadge';
import { X, Calendar, Landmark, Tag, AlignLeft, FileText, ArrowRight } from 'lucide-react';
import type { Transaction } from '../../types/transaction';

interface TransactionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  isOpen,
  onClose,
  transaction: tx,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !tx) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 space-y-6 text-left animate-zoom-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">Transaction Details</h3>
            <span className="text-[10px] text-gray-400 font-mono tracking-tight">{tx.id}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all dark:hover:bg-gray-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount Section */}
        <div className="text-center py-4 space-y-1.5 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</span>
          <p
            className={`text-3xl font-black ${
              tx.type === 'INCOME'
                ? 'text-emerald-600 dark:text-emerald-400'
                : tx.type === 'EXPENSE'
                ? 'text-rose-600 dark:text-rose-450'
                : 'text-purple-600 dark:text-purple-400'
            }`}
          >
            {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}
            {formatCurrency(tx.amount)}
          </p>
          <div className="pt-1">
            <TransactionTypeBadge type={tx.type} />
          </div>
        </div>

        {/* Detailed parameters */}
        <div className="space-y-4">
          {/* Date */}
          <div className="flex gap-3 text-sm">
            <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
              <p className="font-bold text-gray-800 dark:text-gray-250">
                {new Date(tx.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Account */}
          <div className="flex gap-3 text-sm">
            <Landmark className="h-5 w-5 text-gray-400 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {tx.type === 'TRANSFER' ? 'Account Path' : 'Account'}
              </p>
              {tx.type === 'TRANSFER' && tx.toAccount ? (
                <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-250">
                  <span>{tx.account.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                  <span className="text-purple-600 dark:text-purple-400">{tx.toAccount.name}</span>
                </div>
              ) : (
                <p className="font-bold text-gray-800 dark:text-gray-250">{tx.account.name}</p>
              )}
            </div>
          </div>

          {/* Category */}
          {tx.type !== 'TRANSFER' && (
            <div className="flex gap-3 text-sm">
              <Tag className="h-5 w-5 text-gray-400 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category</p>
                <p className="font-bold text-gray-800 dark:text-gray-250">
                  {tx.category?.name || 'Uncategorized'}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex gap-3 text-sm">
            <AlignLeft className="h-5 w-5 text-gray-400 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Description</p>
              <p className="font-bold text-gray-800 dark:text-gray-250">
                {tx.description || 'No Description'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {tx.notes && (
            <div className="flex gap-3 text-sm">
              <FileText className="h-5 w-5 text-gray-400 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Notes</p>
                <p className="font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">
                  {tx.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/10 hover:bg-purple-700 transition-all active:scale-[0.98]"
        >
          Close Detail
        </button>
      </div>
    </div>
  );
};
export default TransactionDetails;
