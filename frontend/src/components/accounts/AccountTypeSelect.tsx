import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface AccountTypeSelectProps {
  register: UseFormRegisterReturn;
  error?: string;
}

export const AccountTypeSelect: React.FC<AccountTypeSelectProps> = ({ register, error }) => {
  const options = [
    { value: 'BANK', label: 'Bank Account' },
    { value: 'CASH', label: 'Cash / Wallet' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'INVESTMENT', label: 'Investment Portfolio' },
    { value: 'E_WALLET', label: 'E-Wallet / Digital' },
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Account Type
      </label>
      <select
        id="type"
        {...register}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-900/50'
            : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};
export default AccountTypeSelect;
