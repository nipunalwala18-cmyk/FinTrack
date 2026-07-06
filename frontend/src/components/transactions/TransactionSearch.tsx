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
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/40">
        <Search className="h-4 w-4" />
      </span>
      <input
        type="text"
        placeholder="Search transactions..."
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        className="w-full pl-9 pr-4 py-2 text-sm transition-all focus:outline-none"
        style={{
          background: '#141414',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 8,
          color: '#fff',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
      />
    </div>
  );
};
export default TransactionSearch;
