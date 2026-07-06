import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema } from '../../schemas/transaction.schema';
import type { UpdateTransactionInput } from '../../schemas/transaction.schema';
import { useUpdateTransaction } from '../../hooks/useUpdateTransaction';
import { useGoals } from '../../hooks/useGoals';
import { AccountSelect } from './AccountSelect';
import { CategorySelect } from './CategorySelect';
import { X, Loader2 } from 'lucide-react';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE, INPUT_ERROR_STYLE
} from '../accounts/fieldStyles';
import type { Transaction } from '../../types/transaction';

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { mutate: updateTransaction, isPending } = useUpdateTransaction(onClose);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<any>({
    resolver: zodResolver(createTransactionSchema),
    mode: 'onChange',
  });

  const watchType = watch('type');
  const watchGoalId = watch('goalId');
  const { data: goals = [] } = useGoals();
  const displayGoals = goals.filter(g => g.status === 'ACTIVE' || g.id === watchGoalId);

  // Sync form values on transaction change
  useEffect(() => {
    if (isOpen && transaction) {
      reset({
        type: transaction.type,
        amount: transaction.amount,
        date: new Date(transaction.date).toISOString().split('T')[0],
        description: transaction.description || '',
        notes: transaction.notes || '',
        accountId: transaction.accountId,
        toAccountId: transaction.toAccountId || '',
        categoryId: transaction.categoryId || '',
        goalId: transaction.goalId || '',
        contributionType: transaction.contributionType || 'DEPOSIT',
      });
    }
  }, [isOpen, transaction, reset]);

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

  const onSubmit = (data: any) => {
    if (!transaction) return;
    const payload = {
      ...data,
      categoryId: data.type === 'TRANSFER' ? null : data.categoryId,
      toAccountId: data.type === 'TRANSFER' ? data.toAccountId : null,
      goalId: data.goalId || null,
      contributionType: data.goalId ? (data.contributionType || 'DEPOSIT') : null,
    };
    updateTransaction({ id: transaction.id, data: payload });
  };

  const onError = (formErrors: any) => {
    const firstError = Object.keys(formErrors)[0];
    if (firstError) {
      const el = document.getElementById(firstError);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-4xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.14)',
          borderRadius: 16,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col flex-grow overflow-hidden">
          {/* Header */}
          <div
            className="px-6 py-5 flex items-center justify-between shrink-0"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            <div className="space-y-1 text-left">
              <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
              <p className="text-sm font-semibold text-white/50">Modify transactional values or categories.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl p-2 transition-all disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body - Two Column layout matching Add dialog */}
          <div className="p-6 overflow-y-auto flex-grow scrollbar-hidden">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 text-left">
              {/* Left Column */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider pb-1" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                  Basic Information
                </h3>

                {/* Transaction Type */}
                <div className="space-y-1.5">
                  <label htmlFor="type" className={LABEL_CLS} style={LABEL_STYLE}>
                    Transaction Type
                  </label>
                  <select
                    id="type"
                    disabled={isPending}
                    {...register('type')}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="EXPENSE" style={{ background: '#141414' }}>Expense</option>
                    <option value="INCOME" style={{ background: '#141414' }}>Income</option>
                    <option value="TRANSFER" style={{ background: '#141414' }}>Transfer</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label htmlFor="amount" className={LABEL_CLS} style={LABEL_STYLE}>
                    Amount *
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    disabled={isPending}
                    {...register('amount', { valueAsNumber: true })}
                    className={INPUT_BASE}
                    style={{ ...INPUT_STYLE, border: errors.amount ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = errors.amount ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                  />
                  {errors.amount && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{String((errors.amount as any).message || '')}</p>}
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label htmlFor="date" className={LABEL_CLS} style={LABEL_STYLE}>
                    Date *
                  </label>
                  <input
                    id="date"
                    type="date"
                    disabled={isPending}
                    {...register('date')}
                    className={INPUT_BASE}
                    style={{ ...INPUT_STYLE, border: errors.date ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = errors.date ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                  />
                  {errors.date && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{String((errors.date as any).message || '')}</p>}
                </div>

                {/* Account Selection */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <AccountSelect
                    id="accountId"
                    label={watchType === 'TRANSFER' ? 'From Account' : 'Account'}
                    name="accountId"
                    register={register}
                    errors={errors}
                    disabled={isPending}
                  />

                  {watchType === 'TRANSFER' && (
                    <AccountSelect
                      id="toAccountId"
                      label="To Account"
                      name="toAccountId"
                      register={register}
                      errors={errors}
                      disabled={isPending}
                    />
                  )}
                </div>

                {/* Category Select */}
                {watchType !== 'TRANSFER' && (
                  <CategorySelect
                    register={register}
                    errors={errors}
                    transactionType={watchType}
                    disabled={isPending}
                  />
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider pb-1" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                  Details & Optional
                </h3>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="description" className={LABEL_CLS} style={LABEL_STYLE}>
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    placeholder="e.g. Weekly Groceries"
                    disabled={isPending}
                    {...register('description')}
                    className={INPUT_BASE}
                    style={{ ...INPUT_STYLE, border: errors.description ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = errors.description ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                  />
                  {errors.description && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{String((errors.description as any).message || '')}</p>}
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label htmlFor="notes" className={LABEL_CLS} style={LABEL_STYLE}>
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    placeholder="Additional details..."
                    disabled={isPending}
                    {...register('notes')}
                    className={`${INPUT_BASE} resize-none`}
                    style={{ ...INPUT_STYLE, border: errors.notes ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = errors.notes ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                  />
                  {errors.notes && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{String((errors.notes as any).message || '')}</p>}
                </div>

                {/* Goal Selector */}
                <div className="space-y-1.5">
                  <label htmlFor="goalId" className={LABEL_CLS} style={LABEL_STYLE}>
                    Link to Goal (Optional)
                  </label>
                  <select
                    id="goalId"
                    disabled={isPending}
                    {...register('goalId')}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="" style={{ background: '#141414' }}>No Linked Goal</option>
                    {displayGoals.map((g) => (
                      <option key={g.id} value={g.id} style={{ background: '#141414' }}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contribution Type (only if goal is selected) */}
                {watchGoalId && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className={LABEL_CLS} style={LABEL_STYLE}>
                      Contribution Type *
                    </label>
                    <div
                      className="flex gap-4 p-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '0.5px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <label className="flex items-center gap-2 text-sm text-white cursor-pointer font-medium">
                        <input
                          type="radio"
                          value="DEPOSIT"
                          disabled={isPending}
                          {...register('contributionType')}
                          className="h-4 w-4"
                          style={{ accentColor: '#fff' }}
                        />
                        <span>Deposit to Goal</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-white cursor-pointer font-medium">
                        <input
                          type="radio"
                          value="WITHDRAWAL"
                          disabled={isPending}
                          {...register('contributionType')}
                          className="h-4 w-4"
                          style={{ accentColor: '#fff' }}
                        />
                        <span>Withdrawal from Goal</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 shrink-0 flex justify-end gap-3"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
              style={{
                background: 'transparent',
                border: '0.5px solid rgba(255,255,255,0.18)',
                color: '#fff',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isValid}
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              style={{ background: '#fff', color: '#000' }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditTransactionDialog;
