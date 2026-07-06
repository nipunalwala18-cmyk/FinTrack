import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface CategoryTypeTabsProps {
  activeTab: 'INCOME' | 'EXPENSE';
  onChange: (tab: 'INCOME' | 'EXPENSE') => void;
}

export const CategoryTypeTabs: React.FC<CategoryTypeTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-900 w-full max-w-sm">
      <button
        onClick={() => onChange('EXPENSE')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
          activeTab === 'EXPENSE'
            ? 'bg-white text-gray-900 shadow-xs dark:bg-[#1c1d24] dark:text-white'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        <ArrowDownLeft className="h-4 w-4 text-rose-500" />
        Expenses
      </button>
      <button
        onClick={() => onChange('INCOME')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
          activeTab === 'INCOME'
            ? 'bg-white text-gray-900 shadow-xs dark:bg-[#1c1d24] dark:text-white'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        Income
      </button>
    </div>
  );
};
export default CategoryTypeTabs;
