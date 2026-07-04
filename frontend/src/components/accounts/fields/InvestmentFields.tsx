import React, { useState, useEffect } from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { formatCurrency } from '../../../utils/currency';

interface InvestmentFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isPending: boolean;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const InvestmentFields: React.FC<InvestmentFieldsProps> = ({
  register,
  errors,
  isPending,
  setValue,
  watch,
}) => {
  const watchBalance = watch('balance') || 0;
  const watchInterest = watch('interestRate') || 10;
  const watchDuration = watch('investmentDuration') || 5;

  const [durationPreset, setDurationPreset] = useState<string>('5');

  // Sync duration value when preset changes
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDurationPreset(val);
    if (val !== 'custom') {
      setValue('investmentDuration', parseInt(val, 10));
    }
  };

  // Calculate live projection
  const r = watchInterest / 100;
  const n = watchDuration;
  const pv = watchBalance;
  const fv = pv * Math.pow(1 + r, n);

  return (
    <div className="space-y-4 text-left">
      {/* Portfolio Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Portfolio Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Mutual Funds Portfolio"
          disabled={isPending}
          {...register('name')}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
            errors.name ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
          }`}
        />
        {errors.name && <p className="text-xs font-semibold text-red-500">{(errors.name as any).message}</p>}
      </div>

      {/* Initial Investment */}
      <div className="space-y-1.5">
        <label htmlFor="balance" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Initial Investment *
        </label>
        <input
          id="balance"
          type="number"
          step="any"
          placeholder="100000"
          disabled={isPending}
          {...register('balance', { valueAsNumber: true })}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
            errors.balance ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
          }`}
        />
        {errors.balance && <p className="text-xs font-semibold text-red-500">{(errors.balance as any).message}</p>}
      </div>

      {/* Expected Return % (Slider) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="interestRate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Expected Annual Return
          </label>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {watchInterest}%
          </span>
        </div>
        <input
          id="interestRate"
          type="range"
          min="0"
          max="20"
          step="0.5"
          disabled={isPending}
          {...register('interestRate', { valueAsNumber: true })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-purple-600"
        />
      </div>

      {/* Duration Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="durationPreset" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Investment Duration
          </label>
          <select
            id="durationPreset"
            value={durationPreset}
            onChange={handlePresetChange}
            disabled={isPending}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500"
          >
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="5">5 Years</option>
            <option value="10">10 Years</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {durationPreset === 'custom' && (
          <div className="space-y-1.5">
            <label htmlFor="investmentDuration" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Duration (Years) *
            </label>
            <input
              id="investmentDuration"
              type="number"
              min="1"
              placeholder="5"
              disabled={isPending}
              {...register('investmentDuration', { valueAsNumber: true })}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
                errors.investmentDuration ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
              }`}
            />
            {errors.investmentDuration && (
              <p className="text-xs font-semibold text-red-500">{(errors.investmentDuration as any).message}</p>
            )}
          </div>
        )}
      </div>

      {/* Live Projection Box */}
      <div className="rounded-2xl border border-purple-100 bg-purple-500/[0.02] p-4 dark:border-purple-950/20 text-center space-y-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Projected Future Value
        </span>
        <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
          {formatCurrency(isNaN(fv) ? 0 : fv)}
        </p>
        <p className="text-[10px] text-gray-400 font-medium">
          Based on compounding interest over {watchDuration} years
        </p>
      </div>
    </div>
  );
};
export default InvestmentFields;
