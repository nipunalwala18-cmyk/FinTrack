import React, { useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE,
} from './fieldStyles';

interface AdvancedSettingsProps {
  register: UseFormRegister<any>;
  isPending: boolean;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ register, isPending }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="rounded-xl text-left overflow-hidden"
      style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
        style={{ background: 'rgba(255,255,255,0.03)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      >
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Advanced Settings
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
        ) : (
          <ChevronDown className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
        )}
      </button>

      {isOpen && (
        <div
          className="p-5 space-y-4"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
        >
          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className={LABEL_CLS} style={LABEL_STYLE}>
              Notes
            </label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Include details about the account purpose..."
              disabled={isPending}
              {...register('notes')}
              className={`${INPUT_BASE} resize-none`}
              style={INPUT_STYLE}
              onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
              onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
            />
          </div>

          {/* Toggle Checklist: Include In Net Worth & Archive Account */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Net worth toggle */}
            <div className="flex items-center gap-3">
              <input
                id="includeInNetWorth"
                type="checkbox"
                disabled={isPending}
                {...register('includeInNetWorth')}
                className="h-4 w-4 rounded cursor-pointer focus:ring-1 focus:ring-white focus:ring-offset-0"
                style={{ accentColor: '#fff' }}
              />
              <label
                htmlFor="includeInNetWorth"
                className="text-sm font-semibold cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Include In Net Worth
              </label>
            </div>

            {/* Archive toggle */}
            <div className="flex items-center gap-3">
              <input
                id="isArchived"
                type="checkbox"
                disabled={isPending}
                {...register('isArchived')}
                className="h-4 w-4 rounded cursor-pointer focus:ring-1 focus:ring-white focus:ring-offset-0"
                style={{ accentColor: '#fff' }}
              />
              <label
                htmlFor="isArchived"
                className="text-sm font-semibold cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Archive Account
              </label>
            </div>
          </div>

          {/* Display Order */}
          <div className="space-y-1.5">
            <label htmlFor="displayOrder" className={LABEL_CLS} style={LABEL_STYLE}>
              Display Order
            </label>
            <input
              id="displayOrder"
              type="number"
              placeholder="e.g. 1"
              disabled={isPending}
              {...register('displayOrder', { valueAsNumber: true })}
              className={INPUT_BASE}
              style={INPUT_STYLE}
              onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
              onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedSettings;
