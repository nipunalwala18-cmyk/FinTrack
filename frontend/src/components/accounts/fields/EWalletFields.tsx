import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_ERROR_STYLE, INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE,
} from '../fieldStyles';

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
        <label htmlFor="name" className={LABEL_CLS} style={LABEL_STYLE}>
          Wallet Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. PhonePe Wallet"
          disabled={isPending}
          {...register('name')}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, border: errors.name ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = errors.name ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
        />
        {errors.name && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.name as any).message}</p>}
      </div>

      {/* Current Balance */}
      <div className="space-y-1.5">
        <label htmlFor="balance" className={LABEL_CLS} style={LABEL_STYLE}>
          Current Balance *
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

      {/* Provider Selector */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="providerPreset" className={LABEL_CLS} style={LABEL_STYLE}>
            Provider *
          </label>
          <select
            id="providerPreset"
            value={providerPreset}
            onChange={handleProviderPresetChange}
            disabled={isPending}
            className={`${INPUT_BASE} appearance-none`}
            style={INPUT_STYLE}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
          >
            <option value="PhonePe" style={{ background: '#141414' }}>PhonePe</option>
            <option value="Google Pay" style={{ background: '#141414' }}>Google Pay</option>
            <option value="Paytm" style={{ background: '#141414' }}>Paytm</option>
            <option value="Amazon Pay" style={{ background: '#141414' }}>Amazon Pay</option>
            <option value="Other" style={{ background: '#141414' }}>Other</option>
          </select>
        </div>

        {providerPreset === 'Other' && (
          <div className="space-y-1.5">
            <label htmlFor="provider" className={LABEL_CLS} style={LABEL_STYLE}>
              Provider Name *
            </label>
            <input
              id="provider"
              type="text"
              placeholder="e.g. Mobikwik"
              disabled={isPending}
              {...register('provider')}
              className={INPUT_BASE}
              style={{ ...INPUT_STYLE, border: errors.provider ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
              onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
              onBlur={e => (e.currentTarget.style.border = errors.provider ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
            />
            {errors.provider && (
              <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.provider as any).message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default EWalletFields;
