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

  return (
    <div className="w-full rounded-2xl bg-white p-5 border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Filters & Sorting</h4>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-end">
        {/* Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase">Type</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>

        {/* Account */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase">Account</label>
          <select
            value={filters.accountId || ''}
            onChange={(e) => handleFilterChange('accountId', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase">Category</label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type.toLowerCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase">From Date</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase">To Date</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Sort By */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase">Sort By</label>
          <div className="flex gap-1.5">
            <select
              value={filters.sortBy || 'date'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransactionFilters;
