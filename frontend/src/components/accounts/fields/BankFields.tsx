import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_ERROR_STYLE, INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE,
} from '../fieldStyles';

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
        <label htmlFor="name" className={LABEL_CLS} style={LABEL_STYLE}>
          Bank Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. HDFC Savings"
          disabled={isPending}
          {...register('name')}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, border: errors.name ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = errors.name ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
        />
        {errors.name && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.name as any).message}</p>}
      </div>

      {/* Opening Balance */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="balance" className={LABEL_CLS} style={LABEL_STYLE}>
          Opening Balance *
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

      {/* Account Number & Branch */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-left">
          <label htmlFor="accountNumber" className={LABEL_CLS} style={LABEL_STYLE}>
            Account Number (Optional)
          </label>
          <input
            id="accountNumber"
            type="text"
            placeholder="e.g. 501002394..."
            disabled={isPending}
            {...register('accountNumber')}
            className={INPUT_BASE}
            style={INPUT_STYLE}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label htmlFor="branch" className={LABEL_CLS} style={LABEL_STYLE}>
            Branch (Optional)
          </label>
          <input
            id="branch"
            type="text"
            placeholder="e.g. Mumbai Corporate"
            disabled={isPending}
            {...register('branch')}
            className={INPUT_BASE}
            style={INPUT_STYLE}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
          />
        </div>
      </div>
    </div>
  );
};
export default BankFields;
