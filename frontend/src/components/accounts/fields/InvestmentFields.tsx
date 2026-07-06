import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { formatCurrency } from '../../../utils/currency';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_ERROR_STYLE, INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE,
} from '../fieldStyles';

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
        <label htmlFor="name" className={LABEL_CLS} style={LABEL_STYLE}>
          Portfolio Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Mutual Funds Portfolio"
          disabled={isPending}
          {...register('name')}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, border: errors.name ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = errors.name ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
        />
        {errors.name && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.name as any).message}</p>}
      </div>

      {/* Initial Investment */}
      <div className="space-y-1.5">
        <label htmlFor="balance" className={LABEL_CLS} style={LABEL_STYLE}>
          Initial Investment *
        </label>
        <input
          id="balance"
          type="number"
          step="any"
          placeholder="100000"
          disabled={isPending}
          {...register('balance', { valueAsNumber: true })}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, border: errors.balance ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
          onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.border = errors.balance ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
        />
        {errors.balance && <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.balance as any).message}</p>}
      </div>

      {/* Expected Return % (Slider) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="interestRate" className={LABEL_CLS} style={LABEL_STYLE}>
            Expected Annual Return
          </label>
          <span className="text-sm font-semibold" style={{ color: '#fff' }}>
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
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: '#fff' }}
        />
      </div>

      {/* Duration Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="durationPreset" className={LABEL_CLS} style={LABEL_STYLE}>
            Investment Duration
          </label>
          <select
            id="durationPreset"
            value={durationPreset}
            onChange={handlePresetChange}
            disabled={isPending}
            className={`${INPUT_BASE} appearance-none`}
            style={INPUT_STYLE}
            onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
          >
            <option value="1" style={{ background: '#141414' }}>1 Year</option>
            <option value="2" style={{ background: '#141414' }}>2 Years</option>
            <option value="3" style={{ background: '#141414' }}>3 Years</option>
            <option value="5" style={{ background: '#141414' }}>5 Years</option>
            <option value="10" style={{ background: '#141414' }}>10 Years</option>
            <option value="custom" style={{ background: '#141414' }}>Custom</option>
          </select>
        </div>

        {durationPreset === 'custom' && (
          <div className="space-y-1.5">
            <label htmlFor="investmentDuration" className={LABEL_CLS} style={LABEL_STYLE}>
              Duration (Years) *
            </label>
            <input
              id="investmentDuration"
              type="number"
              min="1"
              placeholder="5"
              disabled={isPending}
              {...register('investmentDuration', { valueAsNumber: true })}
              className={INPUT_BASE}
              style={{ ...INPUT_STYLE, border: errors.investmentDuration ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
              onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
              onBlur={e => (e.currentTarget.style.border = errors.investmentDuration ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
            />
            {errors.investmentDuration && (
              <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>{(errors.investmentDuration as any).message}</p>
            )}
          </div>
        )}
      </div>

      {/* Live Projection Box — monochrome */}
      <div
        className="rounded-xl p-4 text-center space-y-1"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.1)',
        }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Projected Future Value
        </span>
        <p className="text-2xl font-medium" style={{ color: '#fff' }}>
          {formatCurrency(isNaN(fv) ? 0 : fv)}
        </p>
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Based on compounding interest over {watchDuration} years
        </p>
      </div>
    </div>
  );
};
export default InvestmentFields;
