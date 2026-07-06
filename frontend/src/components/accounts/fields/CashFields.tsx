import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_ERROR_STYLE, INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE,
} from '../fieldStyles';

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
        <label htmlFor="name" className={LABEL_CLS} style={LABEL_STYLE}>
          Wallet Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Cash Wallet"
          disabled={isPending}
          {...register('name')}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, border: errors.name ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = errors.name ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
        />
        {errors.name && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.name as any).message}</p>}
      </div>

      {/* Cash Balance */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="balance" className={LABEL_CLS} style={LABEL_STYLE}>
          Cash Balance *
        </label>
        <input
          id="balance"
          type="number"
          step="any"
          placeholder="0"
          disabled={isPending}
          {...register('balance', { valueAsNumber: true })}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, border: errors.balance ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = errors.balance ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
        />
        {errors.balance && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.balance as any).message}</p>}
      </div>
    </div>
  );
};
export default CashFields;
