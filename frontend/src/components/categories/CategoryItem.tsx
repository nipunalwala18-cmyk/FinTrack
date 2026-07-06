import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical, Edit2, Trash2, ChevronDown, ChevronRight, Tags } from 'lucide-react';
import { CATEGORY_ICONS } from './CategoryFormModal';
import type { Category } from '../../types/category';
import { formatCurrency } from '../../utils/currency';

interface CategoryItemProps {
  category: Category;
  isChild?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isChild = false,
  isExpanded = false,
  onToggleExpand,
  onEdit,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const IconComponent = CATEGORY_ICONS[category.icon || ''] || Tags;
  const childCount = category.children?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between rounded-2xl border bg-white p-3.5 shadow-xs transition-all dark:bg-[#12131a] ${
        isChild
          ? 'ml-8 border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-[#12131a]/40'
          : 'border-gray-150 dark:border-gray-800'
      } ${isDragging ? 'border-purple-300 ring-2 ring-purple-500/10 z-10' : 'hover:border-gray-250 dark:hover:border-gray-700'}`}
    >
      {/* Left side: Drag handle + Expand button + Icon + Name */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing dark:hover:text-gray-300"
          title="Drag to reorder"
        >
          <GripVertical className="h-4.5 w-4.5 shrink-0" />
        </button>

        {/* Expand/Collapse for parents */}
        {!isChild && childCount > 0 && onToggleExpand ? (
          <button
            onClick={onToggleExpand}
            className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 text-gray-500 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
          </button>
        ) : (
          !isChild && <div className="w-6 shrink-0" />
        )}

        {/* Color Indicator & Icon */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0 shadow-sm"
          style={{ backgroundColor: category.color || '#2563eb' }}
        >
          <IconComponent className="h-4.5 w-4.5" />
        </div>

        {/* Category Name */}
        <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
          {category.name}
        </span>

        {/* Child Count Badge */}
        {!isChild && childCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-650 dark:bg-purple-950/30 dark:text-purple-400">
            {childCount} {childCount === 1 ? 'sub' : 'subs'}
          </span>
        )}
      </div>

      {/* Right side: Amount + Actions Menu */}
      <div className="flex items-center gap-5">
        {/* Aggregated Amount */}
        <div className="text-right whitespace-nowrap">
          <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block leading-none mb-0.5">
            {category.type === 'EXPENSE' ? 'Spent' : 'Received'}
          </span>
          <span
            className={`text-sm font-extrabold tracking-tight ${
              category.type === 'EXPENSE'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(category.type === 'EXPENSE' ? (category.spent || 0) : (category.received || 0))}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-1.5 text-gray-450 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-white transition-colors"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-36 origin-top-right rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-[#1a1c24] z-50">
              <button
                onClick={() => {
                  onEdit(category);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-850"
              >
                <Edit2 className="h-4 w-4 text-purple-650" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(category);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50/50 dark:text-rose-400 dark:hover:bg-rose-950/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CategoryItem;
