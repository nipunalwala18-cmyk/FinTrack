import React from 'react';
import GoalsAnalytics from '../../components/goals/GoalsAnalytics';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6 w-full text-left">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          Financial Reports
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Analyze your budgets, transactions performance, and financial goals progress.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800">
        <GoalsAnalytics />
      </div>
    </div>
  );
};

export default ReportsPage;

