import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useCreateBudget, useUpdateBudget } from '../../hooks/useBudgets';
import type { BudgetDashboardItem, BudgetPeriod } from '../../types/budget';

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetItem?: BudgetDashboardItem | null;
}

const budgetFormSchema = z
  .object({
    categoryId: z.string().min(1, 'Category is required'),
    period: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    amount: z.number().positive('Budget amount must be greater than zero'),
    alertAt: z.number().int().min(1).max(100).optional().nullable(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'Start date must be before end date',
    path: ['endDate'],
  });

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
  isOpen,
  onClose,
  budgetItem,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const createBudget = useCreateBudget(onClose);
  const updateBudget = useUpdateBudget(onClose);

  const isPending = createBudget.isPending || updateBudget.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    mode: 'onChange',
    defaultValues: {
      categoryId: '',
      period: 'MONTHLY',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        .toISOString()
        .split('T')[0],
      amount: 0,
      alertAt: null,
    },
  });

  const watchPeriod = watch('period');

  // Automatically compute default date ranges based on period selection
  useEffect(() => {
    if (budgetItem) return; // Keep custom date ranges when editing

    const start = new Date();
    const end = new Date();

    if (watchPeriod === 'WEEKLY') {
      // Current week: Monday to Sunday
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      end.setDate(diff + 6);
    } else if (watchPeriod === 'MONTHLY') {
      // Current month: 1st to last day
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (watchPeriod === 'YEARLY') {
      // Current year: Jan 1 to Dec 31
      start.setMonth(0, 1);
      end.setMonth(11, 31);
    }

    setValue('startDate', start.toISOString().split('T')[0]);
    setValue('endDate', end.toISOString().split('T')[0]);
  }, [watchPeriod, setValue, budgetItem]);

  // Set default values when editing
  useEffect(() => {
    if (isOpen) {
      if (budgetItem) {
        reset({
          categoryId: budgetItem.categoryId,
          period: budgetItem.period,
          startDate: budgetItem.startDate.split('T')[0],
          endDate: budgetItem.endDate.split('T')[0],
          amount: budgetItem.budget,
          alertAt: budgetItem.alertTriggered ? 100 : (budgetItem.percentage >= 80 ? 80 : null),
        });
      } else {
        reset({
          categoryId: '',
          period: 'MONTHLY',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            .toISOString()
            .split('T')[0],
          amount: 0,
          alertAt: null,
        });
      }
    }
  }, [isOpen, budgetItem, reset]);

  // Close on Escape key
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
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const onSubmit = (values: BudgetFormValues) => {
    const payload = {
      categoryId: values.categoryId,
      period: values.period as BudgetPeriod,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      amount: values.amount,
      alertAt: values.alertAt ?? null,
    };

    if (budgetItem) {
      updateBudget.mutate({ id: budgetItem.id, data: payload });
    } else {
      createBudget.mutate(payload);
    }
  };

  if (!isOpen) return null;

  // Flatten Expense categories
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');
  const flattenedCategories: { id: string; name: string }[] = [];
  expenseCategories.forEach((parent) => {
    flattenedCategories.push({ id: parent.id, name: parent.name });
    if (parent.children && parent.children.length > 0) {
      parent.children.forEach((child) => {
        flattenedCategories.push({ id: child.id, name: `↳ ${child.name}` });
      });
    }
  });

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="w-[95vw] max-w-lg max-h-[95vh] md:max-h-[90vh] rounded-3xl bg-white shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-zoom-in text-left"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {budgetItem ? 'Edit Budget' : 'Add Budget'}
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                {budgetItem
                  ? 'Update your existing spending limit details.'
                  : 'Establish a new spending limit for a specific category.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all dark:hover:bg-gray-900 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-grow space-y-4">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label htmlFor="categoryId" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Expense Category *
              </label>
              <select
                id="categoryId"
                disabled={isPending || isLoadingCategories}
                {...register('categoryId')}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all ${
                  errors.categoryId ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <option value="">Select Category</option>
                {flattenedCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs font-semibold text-red-500">{errors.categoryId.message}</p>}
            </div>

            {/* Period */}
            <div className="space-y-1.5">
              <label htmlFor="period" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Budget Period
              </label>
              <select
                id="period"
                disabled={isPending}
                {...register('period')}
                className="w-full rounded-xl border border-gray-250 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            {/* Date range grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="startDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  disabled={isPending}
                  {...register('startDate')}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all ${
                    errors.startDate ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800'
                  }`}
                />
                {errors.startDate && <p className="text-xs font-semibold text-red-500">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="endDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  disabled={isPending}
                  {...register('endDate')}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all ${
                    errors.endDate ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800'
                  }`}
                />
                {errors.endDate && <p className="text-xs font-semibold text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            {/* Budget Amount */}
            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Budget Amount *
              </label>
              <input
                type="number"
                id="amount"
                step="0.01"
                placeholder="0.00"
                disabled={isPending}
                {...register('amount', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all ${
                  errors.amount ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800'
                }`}
              />
              {errors.amount && <p className="text-xs font-semibold text-red-500">{errors.amount.message}</p>}
            </div>

            {/* Alert percentage */}
            <div className="space-y-1.5">
              <label htmlFor="alertAt" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Alert Threshold
              </label>
              <select
                id="alertAt"
                disabled={isPending}
                {...register('alertAt', { setValueAs: (v) => v === '' ? null : Number(v) })}
                className="w-full rounded-xl border border-gray-250 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
              >
                <option value="">No Alerts</option>
                <option value="80">At 80% utilization</option>
                <option value="90">At 90% utilization</option>
                <option value="100">At 100% utilization</option>
              </select>
              <p className="text-[11px] text-gray-400 font-medium">
                Get marked highlights when spending exceeds this threshold.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4.5 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-850 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-650 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/10 hover:bg-purple-700 cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {budgetItem ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BudgetFormModal;
