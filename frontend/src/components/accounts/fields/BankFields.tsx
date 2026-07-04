import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface BankFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isPending: boolean;
}

export const BankFields: React.FC<BankFieldsProps> = ({ register, errors, isPending }) => {
  return (
    <div className="space-y-4">
      {/* Bank Name */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Bank Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. HDFC Savings"
          disabled={isPending}
          {...register('name')}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
            errors.name ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
          }`}
        />
        {errors.name && <p className="text-xs font-semibold text-red-500">{(errors.name as any).message}</p>}
      </div>

      {/* Opening Balance */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="balance" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Opening Balance *
        </label>
        <input
          id="balance"
          type="number"
          step="any"
          placeholder="0"
          disabled={isPending}
          {...register('balance', { valueAsNumber: true })}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
            errors.balance ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
          }`}
        />
        {errors.balance && <p className="text-xs font-semibold text-red-500">{(errors.balance as any).message}</p>}
      </div>

      {/* Account Number & Branch */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-left">
          <label htmlFor="accountNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Account Number (Optional)
          </label>
          <input
            id="accountNumber"
            type="text"
            placeholder="e.g. 501002394..."
            disabled={isPending}
            {...register('accountNumber')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label htmlFor="branch" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Branch (Optional)
          </label>
          <input
            id="branch"
            type="text"
            placeholder="e.g. Mumbai Corporate"
            disabled={isPending}
            {...register('branch')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  );
};
export default BankFields;
