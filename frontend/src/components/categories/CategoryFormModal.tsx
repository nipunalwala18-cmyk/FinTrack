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
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE, INPUT_ERROR_STYLE
} from '../accounts/fieldStyles';

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
  const parentCandidates = categories.filter((cat) => {
    if (cat.type !== watchType) return false;
    if (cat.parentId) return false; // Parents can only be root categories
    if (isEdit && cat.id === categoryToEdit?.id) return false;
    return true;
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
        className="w-[95vw] max-w-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in"
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
          <div className="space-y-0.5 text-left">
            <h3 className="text-lg font-bold text-white">
              {isEdit ? 'Edit Category' : 'Create Category'}
            </h3>
            <p className="text-xs font-semibold text-white/50">Manage transaction mapping logic</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-5 scrollbar-hidden text-left">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className={LABEL_CLS} style={LABEL_STYLE}>
              Category Name *
            </label>
            <input
              id="name"
              type="text"
              autoFocus
              {...register('name')}
              className={INPUT_BASE}
              style={{ ...INPUT_STYLE, border: errors.name ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
              onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
              onBlur={e => (e.currentTarget.style.border = errors.name ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
              placeholder="e.g. Groceries, Dividends"
            />
            {errors.name && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{errors.name.message}</p>}
          </div>

          {/* Type Select */}
          <div className="space-y-1.5">
            <label className={LABEL_CLS} style={LABEL_STYLE}>
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'EXPENSE');
                  setValue('parentId', null);
                }}
                className="py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: watchType === 'EXPENSE' ? 'rgba(244,63,94,0.08)' : 'transparent',
                  borderColor: watchType === 'EXPENSE' ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.12)',
                  color: watchType === 'EXPENSE' ? '#f43f5e' : 'rgba(255,255,255,0.5)',
                }}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'INCOME');
                  setValue('parentId', null);
                }}
                className="py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: watchType === 'INCOME' ? 'rgba(16,185,129,0.08)' : 'transparent',
                  borderColor: watchType === 'INCOME' ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)',
                  color: watchType === 'INCOME' ? '#10b981' : 'rgba(255,255,255,0.5)',
                }}
              >
                Income
              </button>
            </div>
          </div>

          {/* Parent Category Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="parentId" className={LABEL_CLS} style={LABEL_STYLE}>
              Parent Category (Optional)
            </label>
            <select
              id="parentId"
              {...register('parentId')}
              onChange={(e) => setValue('parentId', e.target.value || null)}
              value={watch('parentId') || ''}
              className={`${INPUT_BASE} appearance-none cursor-pointer`}
              style={INPUT_STYLE}
              onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
              onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
            >
              <option value="" style={{ background: '#141414' }}>None (Make Root Category)</option>
              {parentCandidates.map((parent) => (
                <option key={parent.id} value={parent.id} style={{ background: '#141414' }}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <label className={LABEL_CLS} style={LABEL_STYLE}>
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
          <div className="space-y-1.5">
            <label className={LABEL_CLS} style={LABEL_STYLE}>
              Icon
            </label>
            <div
              className="grid grid-cols-5 gap-3 max-h-40 overflow-y-auto p-3 rounded-xl scrollbar-hidden"
              style={{
                background: 'rgba(255,255,255,0.01)',
                border: '0.5px solid rgba(255,255,255,0.12)',
              }}
            >
              {Object.entries(CATEGORY_ICONS).map(([name, IconComponent]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setValue('icon', name)}
                  className="flex h-11 items-center justify-center rounded-xl border transition-all cursor-pointer"
                  style={{
                    background: watchIcon === name ? 'rgba(255,255,255,0.08)' : 'transparent',
                    borderColor: watchIcon === name ? '#fff' : 'rgba(255,255,255,0.12)',
                    color: watchIcon === name ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <IconComponent className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div
            className="flex items-center justify-end gap-3 pt-4 shrink-0"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending || updateMutation.isPending}
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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: '#fff', color: '#000' }}
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
