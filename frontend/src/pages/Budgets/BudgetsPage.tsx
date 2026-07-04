import React from 'react';
import { PieChart } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-3xl border border-gray-150 bg-white p-12 dark:border-gray-800 dark:bg-[#12131a] max-w-md w-full space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
          <PieChart className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Budgets</h3>
          <p className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            Coming Soon
          </p>
          <p className="text-sm text-gray-400 pt-2">
            This module is currently under development. Stay tuned for future releases!
          </p>
        </div>
      </div>
    </div>
  );
};
export default BudgetsPage;
