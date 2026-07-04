import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CreditCardFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isPending: boolean;
}

export const CreditCardFields: React.FC<CreditCardFieldsProps> = ({ register, errors, isPending }) => {
  return (
    <div className="space-y-4 text-left">
      {/* Card Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Card Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. My Credit Card"
          disabled={isPending}
          {...register('name')}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
            errors.name ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
          }`}
        />
        {errors.name && <p className="text-xs font-semibold text-red-500">{(errors.name as any).message}</p>}
      </div>

      {/* Grid Outstanding & Limit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="outstandingBalance" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Current Outstanding *
          </label>
          <input
            id="outstandingBalance"
            type="number"
            step="any"
            placeholder="0"
            disabled={isPending}
            {...register('outstandingBalance', { valueAsNumber: true })}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
              errors.outstandingBalance ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
            }`}
          />
          {errors.outstandingBalance && (
            <p className="text-xs font-semibold text-red-500">{(errors.outstandingBalance as any).message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="creditLimit" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Credit Limit *
          </label>
          <input
            id="creditLimit"
            type="number"
            step="any"
            placeholder="50000"
            disabled={isPending}
            {...register('creditLimit', { valueAsNumber: true })}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
              errors.creditLimit ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
            }`}
          />
          {errors.creditLimit && (
            <p className="text-xs font-semibold text-red-500">{(errors.creditLimit as any).message}</p>
          )}
        </div>
      </div>

      {/* Grid Billing Day & Payment Due Day */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="billingDay" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Billing Day (1-31)
          </label>
          <input
            id="billingDay"
            type="number"
            min="1"
            max="31"
            placeholder="15"
            disabled={isPending}
            {...register('billingDay', { valueAsNumber: true })}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
              errors.billingDay ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
            }`}
          />
          {errors.billingDay && (
            <p className="text-xs font-semibold text-red-500">{(errors.billingDay as any).message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="paymentDueDay" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Payment Due Day (1-31)
          </label>
          <input
            id="paymentDueDay"
            type="number"
            min="1"
            max="31"
            placeholder="5"
            disabled={isPending}
            {...register('paymentDueDay', { valueAsNumber: true })}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:text-white ${
              errors.paymentDueDay ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 focus:border-purple-500 dark:border-gray-800'
            }`}
          />
          {errors.paymentDueDay && (
            <p className="text-xs font-semibold text-red-500">{(errors.paymentDueDay as any).message}</p>
          )}
        </div>
      </div>

      {/* Last 4 Digits */}
      <div className="space-y-1.5">
        <label htmlFor="accountNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Last 4 Digits (Optional)
        </label>
        <input
          id="accountNumber"
          type="text"
          maxLength={4}
          placeholder="e.g. 4321"
          disabled={isPending}
          {...register('accountNumber')}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500"
        />
      </div>
    </div>
  );
};
export default CreditCardFields;
