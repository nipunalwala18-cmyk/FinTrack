import React, { useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedSettingsProps {
  register: UseFormRegister<any>;
  isPending: boolean;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ register, isPending }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl dark:border-gray-800 text-left overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-900/10 dark:hover:bg-gray-900/30 transition-all focus:outline-none"
      >
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Advanced Settings
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-800 space-y-4 bg-white dark:bg-transparent">
          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Include details about the account purpose..."
              disabled={isPending}
              {...register('notes')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500"
            />
          </div>

          {/* Toggle Checklist: Include In Net Worth & Archive Account */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Net worth toggle */}
            <div className="flex items-center gap-3">
              <input
                id="includeInNetWorth"
                type="checkbox"
                disabled={isPending}
                {...register('includeInNetWorth')}
                className="h-4.5 w-4.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:ring-offset-gray-900"
              />
              <label htmlFor="includeInNetWorth" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Include In Net Worth
              </label>
            </div>

            {/* Archive toggle */}
            <div className="flex items-center gap-3">
              <input
                id="isArchived"
                type="checkbox"
                disabled={isPending}
                {...register('isArchived')}
                className="h-4.5 w-4.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:ring-offset-gray-900"
              />
              <label htmlFor="isArchived" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Archive Account
              </label>
            </div>
          </div>

          {/* Display Order */}
          <div className="space-y-1.5">
            <label htmlFor="displayOrder" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Display Order
            </label>
            <input
              id="displayOrder"
              type="number"
              placeholder="e.g. 1"
              disabled={isPending}
              {...register('displayOrder', { valueAsNumber: true })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedSettings;
