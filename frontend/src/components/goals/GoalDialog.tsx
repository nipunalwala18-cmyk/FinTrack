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
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE, INPUT_ERROR_STYLE
} from '../accounts/fieldStyles';

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
    formState: { errors, isValid },
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
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
        >
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-bold text-white">
              {goalItem ? 'Edit Goal' : 'Create Financial Goal'}
            </h2>
            <p className="text-sm font-semibold text-white/50">Setup targeted benchmarks for saving allocations.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-all cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hidden text-left">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider pb-1" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                Goal Information
              </h3>

              {/* Goal Name */}
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>
                  Goal Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Dream House Fund, Backup Cash"
                  className={INPUT_BASE}
                  style={{ ...INPUT_STYLE, border: errors.name ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                  onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                  onBlur={e => (e.currentTarget.style.border = errors.name ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                />
                {errors.name && (
                  <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>
                  Description
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Details of the goal..."
                  rows={2}
                  className={`${INPUT_BASE} resize-none`}
                  style={INPUT_STYLE}
                  onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                  onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                />
              </div>

              {/* Target Amount */}
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>
                  Target Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-white/40 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    step="any"
                    {...register('targetAmount', { valueAsNumber: true })}
                    placeholder="0.00"
                    className={`${INPUT_BASE} pl-8`}
                    style={{ ...INPUT_STYLE, border: errors.targetAmount ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = errors.targetAmount ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                  />
                </div>
                {errors.targetAmount && (
                  <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.targetAmount.message}</p>
                )}
              </div>

              {/* Target Date */}
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>
                  Target Date *
                </label>
                <input
                  type="date"
                  {...register('targetDate')}
                  className={INPUT_BASE}
                  style={{ ...INPUT_STYLE, border: errors.targetDate ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
                  onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                  onBlur={e => (e.currentTarget.style.border = errors.targetDate ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
                />
                {errors.targetDate && (
                  <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.targetDate.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider pb-1" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                Visual Customization
              </h3>

              {/* Icon Picker */}
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>
                  Select Icon
                </label>
                <div
                  className="grid grid-cols-6 gap-2 p-3 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.01)',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedIcon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleSelectIcon(item.name)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl transition-all border cursor-pointer"
                        style={{
                          background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                          borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.12)',
                          color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        <IconComp className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>
                  Select Theme Color
                </label>
                <div
                  className="flex flex-wrap gap-2.5 p-3 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.01)',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {AVAILABLE_COLORS.map((col) => {
                    const isSelected = selectedColor === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handleSelectColor(col)}
                        className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-95 cursor-pointer"
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
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-3 pt-4 shrink-0"
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
              <span>{goalItem ? 'Update Goal' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalDialog;
