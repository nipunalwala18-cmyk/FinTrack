import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface EWalletFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isPending: boolean;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const EWalletFields: React.FC<EWalletFieldsProps> = ({
  register,
  errors,
  isPending,
  setValue,
  watch,
}) => {
  const watchProvider = watch('provider') || 'PhonePe';
  const [providerPreset, setProviderPreset] = useState<string>(
    ['PhonePe', 'Google Pay', 'Paytm', 'Amazon Pay'].includes(watchProvider) ? watchProvider : 'Other'
  );

  const handleProviderPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setProviderPreset(val);
    if (val !== 'Other') {
      setValue('provider', val);
    } else {
      setValue('provider', '');
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Wallet Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Wallet Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. PhonePe Wallet"
          disabled={isPending}
          {...register('name')}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
            errors.name ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
          }`}
        />
        {errors.name && <p className="text-xs font-semibold text-red-500">{(errors.name as any).message}</p>}
      </div>

      {/* Current Balance */}
      <div className="space-y-1.5">
        <label htmlFor="balance" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Current Balance *
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

      {/* Provider Selector */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="providerPreset" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Provider *
          </label>
          <select
            id="providerPreset"
            value={providerPreset}
            onChange={handleProviderPresetChange}
            disabled={isPending}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500"
          >
            <option value="PhonePe">PhonePe</option>
            <option value="Google Pay">Google Pay</option>
            <option value="Paytm">Paytm</option>
            <option value="Amazon Pay">Amazon Pay</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {providerPreset === 'Other' && (
          <div className="space-y-1.5">
            <label htmlFor="provider" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Provider Name *
            </label>
            <input
              id="provider"
              type="text"
              placeholder="e.g. Mobikwik"
              disabled={isPending}
              {...register('provider')}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
                errors.provider ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
              }`}
            />
            {errors.provider && (
              <p className="text-xs font-semibold text-red-500">{(errors.provider as any).message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default EWalletFields;
