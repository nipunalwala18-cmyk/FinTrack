import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface TransactionSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({ value, onChange }) => {
  const [localVal, setLocalVal] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localVal);
    }, 400);

    return () => clearTimeout(timer);
  }, [localVal, onChange]);

  return (
    <div className="relative w-full sm:max-w-xs text-left">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
        <Search className="h-4.5 w-4.5" />
      </span>
      <input
        type="text"
        placeholder="Search description, notes, categories..."
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-[#12131a] dark:text-white focus:border-purple-500 transition-all"
      />
    </div>
  );
};
export default TransactionSearch;
