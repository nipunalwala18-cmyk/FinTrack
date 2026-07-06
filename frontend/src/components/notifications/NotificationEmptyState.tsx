import React from 'react';
import { BellOff } from 'lucide-react';

export const NotificationEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-gray-400">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-gray-900/50 mb-3 border border-gray-150/10">
        <BellOff className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">All caught up!</p>
      <p className="text-[10px] text-gray-400 mt-0.5">No new notifications at this time.</p>
    </div>
  );
};
export default NotificationEmptyState;
