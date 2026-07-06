import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Loader2,
  Target,
  PiggyBank,
  TrendingUp,
  Wallet,
  Heart,
  Trophy,
  ShoppingBag,
  Car,
  Home,
  Gift,
  Compass,
  Coffee
} from 'lucide-react';
import { useCreateGoal, useUpdateGoal } from '../../hooks/useGoals';
import type { Goal } from '../../types/goal';

interface GoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goalItem?: Goal | null;
}

const goalFormSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  description: z.string().nullable().optional(),
  targetAmount: z.number().positive('Target amount must be greater than zero'),
  targetDate: z.string().min(1, 'Target date is required'),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const AVAILABLE_ICONS = [
  { name: 'Target', icon: Target },
  { name: 'PiggyBank', icon: PiggyBank },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Wallet', icon: Wallet },
  { name: 'Heart', icon: Heart },
  { name: 'Trophy', icon: Trophy },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Car', icon: Car },
  { name: 'Home', icon: Home },
  { name: 'Gift', icon: Gift },
  { name: 'Compass', icon: Compass },
  { name: 'Coffee', icon: Coffee },
];

const AVAILABLE_COLORS = [
  '#9333ea', // Purple
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f97316', // Orange
];

export const GoalDialog: React.FC<GoalDialogProps> = ({ isOpen, onClose, goalItem }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const createGoal = useCreateGoal(onClose);
  const updateGoal = useUpdateGoal(onClose);

  const isPending = createGoal.isPending || updateGoal.isPending;

  const [selectedIcon, setSelectedIcon] = useState('Target');
  const [selectedColor, setSelectedColor] = useState('#9333ea');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      targetAmount: 0,
      targetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate())
        .toISOString()
        .split('T')[0],
      color: '#9333ea',
      icon: 'Target',
    },
  });

  // Sync state when goalItem or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (goalItem) {
        reset({
          name: goalItem.name,
          description: goalItem.description || '',
          targetAmount: goalItem.targetAmount,
          targetDate: goalItem.targetDate
            ? goalItem.targetDate.split('T')[0]
            : (goalItem.endDate ? goalItem.endDate.split('T')[0] : new Date().toISOString().split('T')[0]),
          color: goalItem.color || '#9333ea',
          icon: goalItem.icon || 'Target',
        });
        setSelectedIcon(goalItem.icon || 'Target');
        setSelectedColor(goalItem.color || '#9333ea');
      } else {
        reset({
          name: '',
          description: '',
          targetAmount: 0,
          targetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate())
            .toISOString()
            .split('T')[0],
          color: '#9333ea',
          icon: 'Target',
        });
        setSelectedIcon('Target');
        setSelectedColor('#9333ea');
      }
    }
  }, [isOpen, goalItem, reset]);

  // Handle escape key
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

  const handleSelectIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setValue('icon', iconName);
  };

  const handleSelectColor = (colorHex: string) => {
    setSelectedColor(colorHex);
    setValue('color', colorHex);
  };

  const onSubmit = (values: GoalFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || null,
      targetAmount: values.targetAmount,
      targetDate: new Date(values.targetDate).toISOString(),
      color: selectedColor,
      icon: selectedIcon,
    };

    if (goalItem) {
      updateGoal.mutate({ id: goalItem.id, data: payload });
    } else {
      createGoal.mutate(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl dark:bg-[#12131a] border border-gray-150 dark:border-gray-800 flex flex-col overflow-hidden animate-zoom-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {goalItem ? 'Edit Goal' : 'Create Financial Goal'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Goal Name */}
            <div className="space-y-1.5 md:col-span-2 text-left">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Goal Name *
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Dream House Fund, Backup Cash"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
              {errors.name && (
                <p className="text-xs font-semibold text-rose-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2 text-left">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="Details of the goal..."
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* Target Amount */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Target Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="any"
                  {...register('targetAmount', { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold"
                />
              </div>
              {errors.targetAmount && (
                <p className="text-xs font-semibold text-rose-500">{errors.targetAmount.message}</p>
              )}
            </div>

            {/* Target Date */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Target Date *
              </label>
              <input
                type="date"
                {...register('targetDate')}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
              {errors.targetDate && (
                <p className="text-xs font-semibold text-rose-500">{errors.targetDate.message}</p>
              )}
            </div>

            {/* Icon Picker */}
            <div className="space-y-1.5 md:col-span-2 text-left">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Select Icon
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2.5 p-3 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                {AVAILABLE_ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = selectedIcon === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelectIcon(item.name)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20 scale-105'
                          : 'bg-white dark:bg-gray-950 border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800'
                      }`}
                    >
                      <IconComp className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-1.5 md:col-span-2 text-left">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Select Theme Color
              </label>
              <div className="flex flex-wrap gap-3 p-3 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                {AVAILABLE_COLORS.map((col) => {
                  const isSelected = selectedColor === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => handleSelectColor(col)}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-95"
                      style={{ backgroundColor: col }}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 rounded-full border-2 border-white dark:border-gray-900 scale-[0.6] bg-white dark:bg-[#12131a]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-gray-250 dark:border-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{goalItem ? 'Update Goal' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalDialog;
