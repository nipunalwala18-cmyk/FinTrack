import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface CategoryTypeTabsProps {
  activeTab: 'INCOME' | 'EXPENSE';
  onChange: (tab: 'INCOME' | 'EXPENSE') => void;
}

export const CategoryTypeTabs: React.FC<CategoryTypeTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div
      className="flex p-1 w-full max-w-xs"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
      }}
    >
      <button
        onClick={() => onChange('EXPENSE')}
        className="flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer"
        style={{
          borderRadius: 8,
          background: activeTab === 'EXPENSE' ? '#fff' : 'transparent',
          color: activeTab === 'EXPENSE' ? '#000' : 'rgba(255,255,255,0.5)',
        }}
      >
        <ArrowDownLeft className="h-3.5 w-3.5" style={{ color: activeTab === 'EXPENSE' ? '#000' : 'rgba(255,255,255,0.5)' }} />
        Expenses
      </button>
      <button
        onClick={() => onChange('INCOME')}
        className="flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer"
        style={{
          borderRadius: 8,
          background: activeTab === 'INCOME' ? '#fff' : 'transparent',
          color: activeTab === 'INCOME' ? '#000' : 'rgba(255,255,255,0.5)',
        }}
      >
        <ArrowUpRight className="h-3.5 w-3.5" style={{ color: activeTab === 'INCOME' ? '#000' : 'rgba(255,255,255,0.5)' }} />
        Income
      </button>
    </div>
  );
};
export default CategoryTypeTabs;
