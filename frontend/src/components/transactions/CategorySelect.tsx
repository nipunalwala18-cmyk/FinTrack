import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { UseFormRegister } from 'react-hook-form';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE, INPUT_ERROR_STYLE
} from '../accounts/fieldStyles';

interface CategorySelectProps {
  register: UseFormRegister<any>;
  errors: any;
  transactionType: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  register,
  errors,
  transactionType,
  disabled = false,
}) => {
  const { data: categories = [], isLoading } = useCategories();
  const hasError = !!errors.categoryId;

  // Filter categories by matching type
  const filteredCategories = categories.filter((cat) => cat.type === transactionType);

  if (transactionType === 'TRANSFER') return null;

  return (
    <div className="space-y-1.5 text-left w-full">
      <label htmlFor="categoryId" className={LABEL_CLS} style={LABEL_STYLE}>
        Category *
      </label>
      <select
        id="categoryId"
        disabled={disabled || isLoading}
        {...register('categoryId')}
        className={`${INPUT_BASE} appearance-none cursor-pointer`}
        style={{ ...INPUT_STYLE, border: hasError ? INPUT_ERROR_STYLE : INPUT_STYLE.border }}
        onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
        onBlur={e => (e.currentTarget.style.border = hasError ? INPUT_ERROR_STYLE : INPUT_BLUR_STYLE)}
      >
        <option value="" style={{ background: '#141414' }}>Select Category</option>
        {filteredCategories.map((cat) => (
          <option key={cat.id} value={cat.id} style={{ background: '#141414' }}>
            {cat.name}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="text-xs font-semibold" style={{ color: 'rgba(248,113,113,0.9)' }}>
          {String(errors.categoryId?.message || '')}
        </p>
      )}
    </div>
  );
};
export default CategorySelect;
