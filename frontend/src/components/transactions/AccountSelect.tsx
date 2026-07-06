import React from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import type { UseFormRegister } from 'react-hook-form';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE, INPUT_ERROR_STYLE
} from '../accounts/fieldStyles';

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
  const hasError = !!errors[name];

  return (
    <div className="space-y-1.5 text-left w-full">
      <label htmlFor={id} className={LABEL_CLS} style={LABEL_STYLE}>
        {label} *
      </label>
      <select
        id={id}
        disabled={disabled || isLoading}
        {...register(name)}
        className={`${INPUT_BASE} appearance-none cursor-pointer`}
        style={{ ...INPUT_STYLE, border: hasError ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
        onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
        onBlur={e => (e.currentTarget.style.border = hasError ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
      >
        <option value="" style={{ background: '#141414' }}>Select Account</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id} style={{ background: '#141414' }}>
            {acc.name} (₹{acc.balance.toLocaleString()})
          </option>
        ))}
      </select>
      {hasError && (
        <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>
          {String(errors[name]?.message || '')}
        </p>
      )}
    </div>
  );
};
export default AccountSelect;
