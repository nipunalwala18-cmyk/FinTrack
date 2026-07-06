import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { RefreshCw } from 'lucide-react';

interface TransactionFiltersProps {
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
  onClear: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const handleFilterChange = (key: string, value: any) => {
    onChange({
      ...filters,
      [key]: value === '' ? undefined : value,
      page: 1, // Reset page to 1 when filters change
    });
  };

  const labelStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.6)',
  };

  const selectStyle: React.CSSProperties = {
    background: '#141414',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#fff',
  };

  return (
    <div
      className="w-full p-5 text-left"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
      }}
    >
      <div className="flex items-center justify-between pb-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
        <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Filters & Sorting</h4>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-end pt-4">
        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block" style={labelStyle}>Type</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 text-xs transition-all focus:outline-none appearance-none cursor-pointer"
            style={selectStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            <option value="" style={{ background: '#141414' }}>All Types</option>
            <option value="INCOME" style={{ background: '#141414' }}>Income</option>
            <option value="EXPENSE" style={{ background: '#141414' }}>Expense</option>
            <option value="TRANSFER" style={{ background: '#141414' }}>Transfer</option>
          </select>
        </div>

        {/* Account */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block" style={labelStyle}>Account</label>
          <select
            value={filters.accountId || ''}
            onChange={(e) => handleFilterChange('accountId', e.target.value)}
            className="w-full px-3 py-2 text-xs transition-all focus:outline-none appearance-none cursor-pointer"
            style={selectStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            <option value="" style={{ background: '#141414' }}>All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id} style={{ background: '#141414' }}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block" style={labelStyle}>Category</label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 text-xs transition-all focus:outline-none appearance-none cursor-pointer"
            style={selectStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            <option value="" style={{ background: '#141414' }}>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} style={{ background: '#141414' }}>
                {cat.name} ({cat.type.toLowerCase()})
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block" style={labelStyle}>From Date</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 text-xs transition-all focus:outline-none cursor-pointer"
            style={selectStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>

        {/* To Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block" style={labelStyle}>To Date</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full px-3 py-2 text-xs transition-all focus:outline-none cursor-pointer"
            style={selectStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block" style={labelStyle}>Sort By</label>
          <div className="flex gap-1.5">
            <select
              value={filters.sortBy || 'date'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 text-xs transition-all focus:outline-none appearance-none cursor-pointer"
              style={selectStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <option value="date" style={{ background: '#141414' }}>Date</option>
              <option value="amount" style={{ background: '#141414' }}>Amount</option>
            </select>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-2 py-2 text-xs transition-all focus:outline-none appearance-none cursor-pointer"
              style={selectStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <option value="desc" style={{ background: '#141414' }}>↓</option>
              <option value="asc" style={{ background: '#141414' }}>↑</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransactionFilters;
