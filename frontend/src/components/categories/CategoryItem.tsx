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
    opacity: isDragging ? 0.5 : 1,
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
      className={`group flex items-center justify-between p-3.5 transition-all text-left ${
        isChild
          ? 'ml-8 bg-white/[0.01]'
          : ''
      }`}
      style={{
        ...style,
        background: isChild ? 'rgba(255,255,255,0.01)' : '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        boxShadow: isDragging ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : 'none',
        zIndex: isDragging ? 50 : 'auto',
      }}
    >
      {/* Left side: Drag handle + Expand button + Icon + Name */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 text-white/30 hover:text-white/70 active:cursor-grabbing shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="h-4.5 w-4.5 shrink-0" />
        </button>

        {/* Expand/Collapse for parents */}
        {!isChild && childCount > 0 && onToggleExpand ? (
          <button
            onClick={onToggleExpand}
            className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
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

        {/* Category Name & Parent Details */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-white truncate">
            {category.name}
          </span>
          {isChild && (
            <span className="text-[10px] uppercase font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Subcategory
            </span>
          )}
        </div>

        {/* Child Count Badge */}
        {!isChild && childCount > 0 && (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
            {childCount} {childCount === 1 ? 'sub' : 'subs'}
          </span>
        )}
      </div>

      {/* Right side: Amount + Actions Menu */}
      <div className="flex items-center gap-4">
        {/* Aggregated Amount */}
        <div className="text-right whitespace-nowrap">
          <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider block leading-none mb-0.5">
            {category.type === 'EXPENSE' ? 'Spent' : 'Received'}
          </span>
          <span
            className={`text-sm font-semibold tracking-tight ${
              category.type === 'EXPENSE'
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}
          >
            {formatCurrency(category.type === 'EXPENSE' ? (category.spent || 0) : (category.received || 0))}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 mt-1.5 w-32 origin-top-right p-1.5 shadow-xl z-50 text-left"
              style={{
                background: '#141414',
                border: '0.5px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
              }}
            >
              <button
                onClick={() => {
                  onEdit(category);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5 text-white/60" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(category);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
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
