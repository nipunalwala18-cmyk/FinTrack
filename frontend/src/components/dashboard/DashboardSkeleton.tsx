import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Welcome Card Skeleton */}
      <div className="w-full rounded-2xl bg-gray-200 dark:bg-gray-800/60 p-6 border border-transparent h-24 flex items-center justify-between">
        <div className="space-y-2 text-left">
          <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-xl" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-200 dark:bg-gray-800/60 p-6 border border-transparent h-36 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-36 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Stats Skeleton */}
      <div className="w-full rounded-2xl bg-gray-200 dark:bg-gray-800/60 p-6 border border-transparent space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-300/40 dark:border-gray-700/40">
          <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-6 w-28 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-300/30 dark:bg-gray-700/30 h-20"
            >
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-xl" />
              <div className="space-y-2">
                <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
