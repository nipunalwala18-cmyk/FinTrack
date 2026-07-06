import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Edit2, Trash2, Tags, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { CATEGORY_ICONS } from '../categories/CategoryFormModal';
import { BudgetProgress } from './BudgetProgress';
import { BudgetStatusBadge } from './BudgetStatusBadge';
import type { BudgetDashboardItem } from '../../types/budget';

interface BudgetCardProps {
  item: BudgetDashboardItem;
  onEdit: (item: BudgetDashboardItem) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ item, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const IconComponent = CATEGORY_ICONS[item.icon || ''] || Tags;
  const isOverspent = item.percentage >= 100;
  const isNearLimit = item.percentage >= 80 && item.percentage < 100;

  const cardBorderClass = isOverspent
    ? 'border-red-500 shadow-md shadow-red-500/5'
    : item.alertTriggered
    ? 'border-red-400 shadow-xs shadow-red-500/5'
    : isNearLimit
    ? 'border-amber-400'
    : 'border-gray-150 dark:border-gray-800';

  return (
    <div className={`rounded-3xl border bg-white p-5 space-y-4 hover:shadow-md transition-all dark:bg-[#12131a] text-left ${cardBorderClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm shrink-0"
            style={{ backgroundColor: item.color || '#2563eb' }}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[150px]">
              {item.category}
            </h4>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">
              {item.period.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Action button menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-1 text-gray-450 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-32 origin-top-right rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-[#1a1c24] z-10">
              <button
                onClick={() => {
                  onEdit(item);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-850 cursor-pointer"
              >
                <Edit2 className="h-4 w-4 text-purple-650" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(item.id);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50/50 dark:text-rose-400 dark:hover:bg-rose-950/20 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress metrics */}
      <BudgetProgress percentage={item.percentage} />

      {/* Numerical Stats */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Budget</span>
          <span className="text-sm font-extrabold text-gray-900 dark:text-white block">
            {formatCurrency(item.budget)}
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Spent</span>
          <span className="text-sm font-extrabold text-gray-900 dark:text-white block">
            {formatCurrency(item.actual)}
          </span>
        </div>
        <div className="space-y-0.5 text-right">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Remaining</span>
          <span className={`text-sm font-extrabold block ${item.remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-455'}`}>
            {formatCurrency(item.remaining)}
          </span>
        </div>
      </div>

      {/* Status & Alerts footer */}
      <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/80 pt-3 min-h-[32px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <BudgetStatusBadge status={item.status} />
          {item.alertTriggered && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/25">
              <AlertCircle className="h-3 w-3 shrink-0" />
              Alert
            </span>
          )}
        </div>

        {isOverspent && (
          <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 shrink-0">
            Overspent by {formatCurrency(Math.abs(item.remaining))}
          </span>
        )}
      </div>
    </div>
  );
};
export default BudgetCard;
