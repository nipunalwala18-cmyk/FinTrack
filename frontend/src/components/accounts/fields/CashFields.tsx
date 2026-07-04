import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CashFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isPending: boolean;
}

export const CashFields: React.FC<CashFieldsProps> = ({ register, errors, isPending }) => {
  return (
    <div className="space-y-4">
      {/* Wallet Name */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Wallet Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Cash Wallet"
          disabled={isPending}
          {...register('name')}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
            errors.name ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
          }`}
        />
        {errors.name && <p className="text-xs font-semibold text-red-500">{(errors.name as any).message}</p>}
      </div>

      {/* Cash Balance */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="balance" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Cash Balance *
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
    </div>
  );
};
export default CashFields;
