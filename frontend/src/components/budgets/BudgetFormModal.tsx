import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useCreateBudget, useUpdateBudget } from '../../hooks/useBudgets';
import type { BudgetDashboardItem, BudgetPeriod } from '../../types/budget';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE, INPUT_ERROR_STYLE
} from '../accounts/fieldStyles';

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
    formState: { errors, isValid },
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
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      end.setDate(diff + 6);
    } else if (watchPeriod === 'MONTHLY') {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (watchPeriod === 'YEARLY') {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="w-[95vw] max-w-4xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in text-left"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.14)',
          borderRadius: 16,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
          {/* Header */}
          <div
            className="px-6 py-5 flex items-center justify-between shrink-0"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">
                {budgetItem ? 'Edit Budget' : 'Add Budget'}
              </h2>
              <p className="text-sm font-semibold text-white/50">
                {budgetItem
                  ? 'Update your existing spending limit details.'
                  : 'Establish a new spending limit for a specific category.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl p-2 transition-all cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body - Two Column responsive layout */}
          <div className="p-6 overflow-y-auto flex-grow scrollbar-hidden">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 text-left">
              {/* Left Column: Scope */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider pb-1" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                  Budget Information
                </h3>

                {/* Category selection */}
                <div className="space-y-1.5">
                  <label htmlFor="categoryId" className={LABEL_CLS} style={LABEL_STYLE}>
                    Expense Category *
                  </label>
                  <select
                    id="categoryId"
                    disabled={isPending || isLoadingCategories}
                    {...register('categoryId')}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={{ ...INPUT_STYLE, border: errors.categoryId ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = errors.categoryId ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                  >
                    <option value="" style={{ background: '#141414' }}>Select Category</option>
                    {flattenedCategories.map((cat) => (
                      <option key={cat.id} value={cat.id} style={{ background: '#141414' }}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.categoryId.message}</p>}
                </div>

                {/* Period */}
                <div className="space-y-1.5">
                  <label htmlFor="period" className={LABEL_CLS} style={LABEL_STYLE}>
                    Budget Period
                  </label>
                  <select
                    id="period"
                    disabled={isPending}
                    {...register('period')}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="WEEKLY" style={{ background: '#141414' }}>Weekly</option>
                    <option value="MONTHLY" style={{ background: '#141414' }}>Monthly</option>
                    <option value="YEARLY" style={{ background: '#141414' }}>Yearly</option>
                  </select>
                </div>

                {/* Date range grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="startDate" className={LABEL_CLS} style={LABEL_STYLE}>
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      disabled={isPending}
                      {...register('startDate')}
                      className={INPUT_BASE}
                      style={{ ...INPUT_STYLE, border: errors.startDate ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                      onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                      onBlur={e => (e.currentTarget.style.border = errors.startDate ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                    />
                    {errors.startDate && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.startDate.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="endDate" className={LABEL_CLS} style={LABEL_STYLE}>
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      disabled={isPending}
                      {...register('endDate')}
                      className={INPUT_BASE}
                      style={{ ...INPUT_STYLE, border: errors.endDate ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                      onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                      onBlur={e => (e.currentTarget.style.border = errors.endDate ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                    />
                    {errors.endDate && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.endDate.message}</p>}
                  </div>
                </div>
              </div>

              {/* Right Column: Values */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider pb-1" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                  Limit & Alerts
                </h3>

                {/* Budget Amount */}
                <div className="space-y-1.5">
                  <label htmlFor="amount" className={LABEL_CLS} style={LABEL_STYLE}>
                    Budget Amount *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    placeholder="0.00"
                    disabled={isPending}
                    {...register('amount', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
                    className={INPUT_BASE}
                    style={{ ...INPUT_STYLE, border: errors.amount ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = errors.amount ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                  />
                  {errors.amount && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.amount.message}</p>}
                </div>

                {/* Alert percentage */}
                <div className="space-y-1.5">
                  <label htmlFor="alertAt" className={LABEL_CLS} style={LABEL_STYLE}>
                    Alert Threshold
                  </label>
                  <select
                    id="alertAt"
                    disabled={isPending}
                    {...register('alertAt', { setValueAs: (v) => v === '' ? null : Number(v) })}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="" style={{ background: '#141414' }}>No Alerts</option>
                    <option value="80" style={{ background: '#141414' }}>At 80% utilization</option>
                    <option value="90" style={{ background: '#141414' }}>At 90% utilization</option>
                    <option value="100" style={{ background: '#141414' }}>At 100% utilization</option>
                  </select>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Get marked highlights when spending exceeds this threshold.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className="px-6 py-4.5 border-t flex justify-end gap-3 shrink-0"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40"
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
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: '#fff', color: '#000' }}
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
