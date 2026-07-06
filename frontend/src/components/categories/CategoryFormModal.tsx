import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Briefcase,
  Laptop,
  TrendingUp,
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Zap,
  Tv,
  Gift,
  Heart,
  Shield,
  Coffee,
  Clapperboard,
  Shirt,
  Dumbbell,
  Plane,
  Book,
  DollarSign,
  Wallet,
  Check,
} from 'lucide-react';
import { useCategories, useCreateCategory, useUpdateCategory } from '../../hooks/useCategories';
import type { Category } from '../../types/category';

// Map string icon names to Lucide components
export const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  briefcase: Briefcase,
  laptop: Laptop,
  'trending-up': TrendingUp,
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  car: Car,
  home: Home,
  zap: Zap,
  tv: Tv,
  gift: Gift,
  heart: Heart,
  shield: Shield,
  coffee: Coffee,
  clapperboard: Clapperboard,
  shirt: Shirt,
  dumbbell: Dumbbell,
  plane: Plane,
  book: Book,
  'dollar-sign': DollarSign,
  wallet: Wallet,
};

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#34D399', // Mint
  '#60A5FA', // Blue
  '#3B82F6', // Royal Blue
  '#8B5CF6', // Purple
  '#A78BFA', // Violet
  '#EC4899', // Pink
  '#F472B6', // Light Pink
  '#F87171', // Red
  '#EF4444', // Dark Red
  '#FBBF24', // Yellow
  '#F97316', // Orange
  '#6B7280', // Gray
  '#14B8A6', // Teal
];

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  type: z.enum(['INCOME', 'EXPENSE']),
  parentId: z.string().nullable().optional(),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().min(1, 'Icon is required'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  defaultType?: 'INCOME' | 'EXPENSE';
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  defaultType = 'EXPENSE',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: categories = [] } = useCategories();

  const isEdit = !!categoryToEdit;
  const createMutation = useCreateCategory(onClose);
  const updateMutation = useUpdateCategory(onClose);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      type: defaultType,
      parentId: null,
      color: PRESET_COLORS[0],
      icon: 'shopping-bag',
    },
  });

  const watchType = watch('type');
  const watchColor = watch('color');
  const watchIcon = watch('icon');

  // Reset form when modal opens/closes or categoryToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          type: categoryToEdit.type,
          parentId: categoryToEdit.parentId || null,
          color: categoryToEdit.color || PRESET_COLORS[0],
          icon: categoryToEdit.icon || 'shopping-bag',
        });
      } else {
        reset({
          name: '',
          type: defaultType,
          parentId: null,
          color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
          icon: defaultType === 'INCOME' ? 'briefcase' : 'shopping-bag',
        });
      }
    }
  }, [isOpen, categoryToEdit, defaultType, reset]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      type: values.type,
      color: values.color,
      icon: values.icon,
      parentId: values.parentId || null,
    };

    if (isEdit && categoryToEdit) {
      updateMutation.mutate({ id: categoryToEdit.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (!isOpen) return null;

  // Filter candidates for Parent Category:
  // 1. Must match the selected Type (INCOME/EXPENSE)
  // 2. Must be a root category (parentId is null/undefined)
  // 3. Must not be the current category itself (if editing)
  // 4. Must not be one of the children (already handled because we only show root categories anyway, and roots cannot have parentId)
  const parentCandidates = categories.filter((cat) => {
    if (cat.type !== watchType) return false;
    if (cat.parentId) return false; // Parents can only be root categories
    if (isEdit && cat.id === categoryToEdit?.id) return false;
    return true;
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
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-zoom-in max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-black text-gray-900 dark:text-white">
            {isEdit ? 'Edit Category' : 'Create Category'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Category Name *
            </label>
            <input
              id="name"
              type="text"
              autoFocus
              {...register('name')}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all ${
                errors.name ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800'
              }`}
              placeholder="e.g. Groceries, Dividends"
            />
            {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>}
          </div>

          {/* Type Select */}
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'EXPENSE');
                  setValue('parentId', null); // Reset parent selection when changing types
                }}
                className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  watchType === 'EXPENSE'
                    ? 'border-rose-500 bg-rose-50/50 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50'
                    : 'border-gray-250 hover:bg-gray-50 text-gray-600 dark:border-gray-800 dark:hover:bg-gray-900 dark:text-gray-400'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'INCOME');
                  setValue('parentId', null); // Reset parent selection when changing types
                }}
                className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  watchType === 'INCOME'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                    : 'border-gray-250 hover:bg-gray-50 text-gray-600 dark:border-gray-800 dark:hover:bg-gray-900 dark:text-gray-400'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Parent Category Dropdown */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="parentId" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Parent Category (Optional)
            </label>
            <select
              id="parentId"
              {...register('parentId')}
              onChange={(e) => setValue('parentId', e.target.value || null)}
              value={watch('parentId') || ''}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
            >
              <option value="">None (Make Root Category)</option>
              {parentCandidates.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Theme Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setValue('color', col)}
                  className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: col }}
                >
                  {watchColor === col && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-3 max-h-40 overflow-y-auto p-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
              {Object.entries(CATEGORY_ICONS).map(([name, IconComponent]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setValue('icon', name)}
                  className={`flex h-11 items-center justify-center rounded-xl border transition-all ${
                    watchIcon === name
                      ? 'border-purple-600 bg-purple-50 text-purple-600 dark:border-purple-500/50 dark:bg-purple-950/20 dark:text-purple-400'
                      : 'border-gray-150 hover:bg-gray-50 text-gray-500 dark:border-gray-850 dark:hover:bg-gray-900 dark:text-gray-400'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-lg shadow-purple-500/10 transition-colors flex items-center gap-2 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>Saving...</>
              ) : (
                <>{isEdit ? 'Save Changes' : 'Add Category'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CategoryFormModal;
