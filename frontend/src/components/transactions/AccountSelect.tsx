import React from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import type { UseFormRegister } from 'react-hook-form';

interface AccountSelectProps {
  id: string;
  label: string;
  register: UseFormRegister<any>;
  name: string;
  errors: any;
  disabled?: boolean;
}

export const AccountSelect: React.FC<AccountSelectProps> = ({
  id,
  label,
  register,
  name,
  errors,
  disabled = false,
}) => {
  const { data: accounts = [], isLoading } = useAccounts();

  return (
    <div className="space-y-1.5 text-left w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label} *
      </label>
      <select
        id={id}
        disabled={disabled || isLoading}
        {...register(name)}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all ${
          errors[name] ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800'
        }`}
      >
        <option value="">Select Account</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.name} (₹{acc.balance.toLocaleString()})
          </option>
        ))}
      </select>
      {errors[name] && <p className="text-xs font-semibold text-red-500">{errors[name].message}</p>}
    </div>
  );
};
export default AccountSelect;
