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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-md p-6 shadow-2xl text-left space-y-6 animate-zoom-in"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.14)',
          borderRadius: 16,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between pb-4"
          style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
        >
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-white">Transaction Details</h3>
            <span className="text-[10px] tracking-tight" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.id}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount Section */}
        <div
          className="text-center py-4 space-y-1.5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Amount</span>
          <p
            className={`text-3xl font-semibold tracking-tight ${
              tx.type === 'INCOME'
                ? 'text-emerald-400'
                : tx.type === 'EXPENSE'
                ? 'text-rose-400'
                : 'text-white'
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
            <Calendar className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Date</p>
              <p className="font-semibold text-white/90">
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
            <Landmark className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {tx.type === 'TRANSFER' ? 'Account Path' : 'Account'}
              </p>
              {tx.type === 'TRANSFER' && tx.toAccount ? (
                <div className="flex items-center gap-1.5 font-semibold text-white/90">
                  <span>{tx.account.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/40 shrink-0" />
                  <span className="text-white">{tx.toAccount.name}</span>
                </div>
              ) : (
                <p className="font-semibold text-white/90">{tx.account.name}</p>
              )}
            </div>
          </div>

          {/* Category */}
          {tx.type !== 'TRANSFER' && (
            <div className="flex gap-3 text-sm">
              <Tag className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Category</p>
                <p className="font-semibold text-white/90">
                  {tx.category?.name || 'Uncategorized'}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex gap-3 text-sm">
            <AlignLeft className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Description</p>
              <p className="font-semibold text-white/90">
                {tx.description || 'No Description'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {tx.notes && (
            <div className="flex gap-3 text-sm">
              <FileText className="h-5 w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Notes</p>
                <p className="font-normal leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {tx.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          Close Detail
        </button>
      </div>
    </div>
  );
};
export default TransactionDetails;
