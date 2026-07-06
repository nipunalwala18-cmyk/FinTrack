/**
 * Shared Tailwind + inline-style class strings for all form fields
 * in the Add Account modal — B&W design system.
 *
 * Usage:
 *   className={INPUT_CLS(!!errors.fieldName)}
 *   style={INPUT_STYLE}
 *   onFocus={INPUT_FOCUS}
 *   onBlur={INPUT_BLUR}
 *
 *   className={LABEL_CLS}
 */

export const LABEL_CLS =
  'text-xs font-semibold uppercase tracking-wider block';

export const LABEL_STYLE: React.CSSProperties = {
  color: 'rgba(255,255,255,0.6)',
};

export const INPUT_BASE =
  'w-full px-4 py-3 text-sm transition-all focus:outline-none disabled:opacity-50';

/** Returns className string; pass hasError for error border variant */
export const INPUT_CLS = (_hasError: boolean) => INPUT_BASE;

export const INPUT_STYLE: React.CSSProperties = {
  background: '#141414',
  border: '0.5px solid rgba(255,255,255,0.14)',
  borderRadius: 8,
  color: '#fff',
};

export const INPUT_FOCUS_STYLE = '0.5px solid rgba(255,255,255,0.32)';
export const INPUT_BLUR_STYLE = '0.5px solid rgba(255,255,255,0.14)';
export const INPUT_ERROR_STYLE = '0.5px solid rgba(248,113,113,0.6)';

export const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.border = INPUT_FOCUS_STYLE;
};

export const handleInputBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  hasError: boolean
) => {
  e.currentTarget.style.border = hasError ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE;
};
