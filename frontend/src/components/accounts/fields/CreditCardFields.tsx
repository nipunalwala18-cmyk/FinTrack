import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_ERROR_STYLE, INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE,
} from '../fieldStyles';

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
        <label htmlFor="name" className={LABEL_CLS} style={LABEL_STYLE}>
          Card Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. My Credit Card"
          disabled={isPending}
          {...register('name')}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, border: errors.name ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = errors.name ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
        />
        {errors.name && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.name as any).message}</p>}
      </div>

      {/* Grid Outstanding & Limit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="outstandingBalance" className={LABEL_CLS} style={LABEL_STYLE}>
            Current Outstanding *
          </label>
          <input
            id="outstandingBalance"
            type="number"
            step="any"
            placeholder="0"
            disabled={isPending}
            {...register('outstandingBalance', { valueAsNumber: true })}
            className={INPUT_BASE}
            style={{ ...INPUT_STYLE, border: errors.outstandingBalance ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = errors.outstandingBalance ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
          />
          {errors.outstandingBalance && (
            <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.outstandingBalance as any).message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="creditLimit" className={LABEL_CLS} style={LABEL_STYLE}>
            Credit Limit *
          </label>
          <input
            id="creditLimit"
            type="number"
            step="any"
            placeholder="50000"
            disabled={isPending}
            {...register('creditLimit', { valueAsNumber: true })}
            className={INPUT_BASE}
            style={{ ...INPUT_STYLE, border: errors.creditLimit ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = errors.creditLimit ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
          />
          {errors.creditLimit && (
            <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.creditLimit as any).message}</p>
          )}
        </div>
      </div>

      {/* Grid Billing Day & Payment Due Day */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="billingDay" className={LABEL_CLS} style={LABEL_STYLE}>
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
            className={INPUT_BASE}
            style={{ ...INPUT_STYLE, border: errors.billingDay ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = errors.billingDay ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
          />
          {errors.billingDay && (
            <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.billingDay as any).message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="paymentDueDay" className={LABEL_CLS} style={LABEL_STYLE}>
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
            className={INPUT_BASE}
            style={{ ...INPUT_STYLE, border: errors.paymentDueDay ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = errors.paymentDueDay ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
          />
          {errors.paymentDueDay && (
            <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.paymentDueDay as any).message}</p>
          )}
        </div>
      </div>

      {/* Last 4 Digits */}
      <div className="space-y-1.5">
        <label htmlFor="accountNumber" className={LABEL_CLS} style={LABEL_STYLE}>
          Last 4 Digits (Optional)
        </label>
        <input
          id="accountNumber"
          type="text"
          maxLength={4}
          placeholder="e.g. 4321"
          disabled={isPending}
          {...register('accountNumber')}
          className={INPUT_BASE}
          style={INPUT_STYLE}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
        />
      </div>
    </div>
  );
};
export default CreditCardFields;
