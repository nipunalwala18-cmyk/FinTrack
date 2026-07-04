import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionPaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  page,
  totalPages,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-5 mt-5">
      <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <span>
          Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of{' '}
          {total} entries
        </span>
        <div className="flex items-center gap-1.5">
          <span>Show</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none dark:border-gray-800 dark:bg-gray-900"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all dark:border-gray-800 dark:bg-[#12131a] dark:text-gray-300 dark:hover:bg-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pgNum = idx + 1;
          const isCurrent = pgNum === page;

          return (
            <button
              key={pgNum}
              onClick={() => onPageChange(pgNum)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-extrabold transition-all ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#12131a] dark:text-gray-300 dark:hover:bg-gray-900'
              }`}
            >
              {pgNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all dark:border-gray-800 dark:bg-[#12131a] dark:text-gray-300 dark:hover:bg-gray-900"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
export default TransactionPagination;
