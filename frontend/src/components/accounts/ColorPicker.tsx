import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface ColorPickerProps {
  register: UseFormRegisterReturn;
  error?: string;
  watchColor?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ register, error, watchColor = '#2563eb' }) => {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor="color" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Theme Color
      </label>
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex-shrink-0 cursor-pointer">
          <input
            id="color"
            type="color"
            {...register}
            className="absolute inset-0 h-full w-full border-0 p-0 scale-150 cursor-pointer"
          />
        </div>
        <div className="flex-grow">
          <input
            type="text"
            value={watchColor}
            readOnly
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono text-gray-500 select-all dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 focus:outline-none"
          />
        </div>
      </div>
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};
export default ColorPicker;
