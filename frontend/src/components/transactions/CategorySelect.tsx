import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { UseFormRegister } from 'react-hook-form';

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

  // Filter categories by matching type
  const filteredCategories = categories.filter((cat) => cat.type === transactionType);

  if (transactionType === 'TRANSFER') return null;

  return (
    <div className="space-y-1.5 text-left w-full">
      <label htmlFor="categoryId" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Category *
      </label>
      <select
        id="categoryId"
        disabled={disabled || isLoading}
        {...register('categoryId')}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all ${
          errors.categoryId ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800'
        }`}
      >
        <option value="">Select Category</option>
        {filteredCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {errors.categoryId && <p className="text-xs font-semibold text-red-500">{errors.categoryId.message}</p>}
    </div>
  );
};
export default CategorySelect;
