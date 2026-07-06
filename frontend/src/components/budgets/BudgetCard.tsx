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
    ? 'rgba(239, 68, 68, 0.4)' // Red border
    : item.alertTriggered
    ? 'rgba(239, 68, 68, 0.3)'
    : isNearLimit
    ? 'rgba(245, 158, 11, 0.4)' // Amber border
    : 'rgba(255, 255, 255, 0.12)';

  return (
    <div
      className="p-5 space-y-4 hover:shadow-lg transition-all text-left group"
      style={{
        background: '#0a0a0a',
        border: `0.5px solid ${cardBorderClass}`,
        borderRadius: 20,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm shrink-0"
            style={{ backgroundColor: item.color || '#2563eb' }}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-white leading-tight truncate max-w-[150px]">
              {item.category}
            </h4>
            <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mt-0.5">
              {item.period.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Action button menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>
          {isMenuOpen && (
            <div
              className="absolute right-0 mt-1.5 w-32 origin-top-right p-1.5 shadow-xl z-10 text-left"
              style={{
                background: '#141414',
                border: '0.5px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
              }}
            >
              <button
                onClick={() => {
                  onEdit(item);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5 text-white/60" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(item.id);
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

      {/* Progress metrics */}
      <BudgetProgress percentage={item.percentage} />

      {/* Numerical Stats */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="space-y-0.5">
          <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider block">Budget</span>
          <span className="text-sm font-semibold text-white block">
            {formatCurrency(item.budget)}
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider block">Spent</span>
          <span className="text-sm font-semibold text-white block">
            {formatCurrency(item.actual)}
          </span>
        </div>
        <div className="space-y-0.5 text-right">
          <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider block">Remaining</span>
          <span className={`text-sm font-semibold block ${item.remaining >= 0 ? 'text-emerald-400' : 'text-rose-455'}`}>
            {formatCurrency(item.remaining)}
          </span>
        </div>
      </div>

      {/* Status & Alerts footer */}
      <div className="flex items-center justify-between border-t pt-3 min-h-[32px]" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <BudgetStatusBadge status={item.status} />
          {item.alertTriggered && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-455 border border-rose-500/20">
              <AlertCircle className="h-3 w-3 shrink-0" />
              Alert
            </span>
          )}
        </div>

        {isOverspent && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-455 shrink-0">
            Overspent by {formatCurrency(Math.abs(item.remaining))}
          </span>
        )}
      </div>
    </div>
  );
};
export default BudgetCard;
