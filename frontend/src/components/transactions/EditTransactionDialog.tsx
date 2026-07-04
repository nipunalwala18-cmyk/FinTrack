import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema } from '../../schemas/transaction.schema';
import type { CreateTransactionInput } from '../../schemas/transaction.schema';
import { useUpdateTransaction } from '../../hooks/useUpdateTransaction';
import { AccountSelect } from './AccountSelect';
import { CategorySelect } from './CategorySelect';
import { X, Loader2 } from 'lucide-react';
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
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    mode: 'onChange',
  });

  const watchType = watch('type');

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

  const onSubmit = (data: CreateTransactionInput) => {
    if (!transaction) return;
    const payload = {
      ...data,
      categoryId: data.type === 'TRANSFER' ? null : data.categoryId,
      toAccountId: data.type === 'TRANSFER' ? data.toAccountId : null,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-lg max-h-[95vh] md:max-h-[90vh] rounded-3xl bg-white shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-zoom-in"
      >
        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col flex-grow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Edit Transaction</h2>
              <p className="text-sm text-gray-400 font-medium">Modify transactional values or categories.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all dark:hover:bg-gray-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-grow space-y-4">
            {/* Transaction Type */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Transaction Type
              </label>
              <select
                id="type"
                disabled={isPending}
                {...register('type')}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Amount *
              </label>
              <input
                id="amount"
                type="number"
                step="any"
                placeholder="0.00"
                disabled={isPending}
                {...register('amount', { valueAsNumber: true })}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
                  errors.amount ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800 focus:border-purple-500'
                }`}
              />
              {errors.amount && <p className="text-xs font-semibold text-red-500">{errors.amount.message}</p>}
            </div>

            {/* Date */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Date *
              </label>
              <input
                id="date"
                type="date"
                disabled={isPending}
                {...register('date')}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
                  errors.date ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800 focus:border-purple-500'
                }`}
              />
              {errors.date && <p className="text-xs font-semibold text-red-500">{errors.date.message}</p>}
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

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <input
                id="description"
                type="text"
                placeholder="e.g. Salary Credit"
                disabled={isPending}
                {...register('description')}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
              />
              {errors.description && <p className="text-xs font-semibold text-red-500">{errors.description.message}</p>}
            </div>

            {/* Notes */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="notes" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Additional details..."
                disabled={isPending}
                {...register('notes')}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
              />
              {errors.notes && <p className="text-xs font-semibold text-red-500">{errors.notes.message}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-[#12131a] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900 disabled:opacity-40 disabled:pointer-events-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isValid}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
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
