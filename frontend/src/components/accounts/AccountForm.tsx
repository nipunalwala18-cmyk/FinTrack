import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAccount } from '../../hooks/useCreateAccount';
import { useAccounts } from '../../hooks/useAccounts';
import { useAvailableColor } from '../../hooks/useAvailableColor';
import { createAccountSchema } from '../../schemas/account.schema';
import type { CreateAccountInput } from '../../schemas/account.schema';
import { ACCOUNT_ICONS } from './constants';
import { BankFields } from './fields/BankFields';
import { CashFields } from './fields/CashFields';
import { CreditCardFields } from './fields/CreditCardFields';
import { InvestmentFields } from './fields/InvestmentFields';
import { EWalletFields } from './fields/EWalletFields';
import { SharedFields } from './fields/SharedFields';
import { AdvancedSettings } from './AdvancedSettings';
import { AccountPreview } from './AccountPreview';
import { Loader2, X } from 'lucide-react';

interface AccountFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PRESET_NAMES = {
  BANK: 'HDFC Savings',
  CASH: 'Cash Wallet',
  INVESTMENT: 'Investment Portfolio',
  CREDIT_CARD: 'My Credit Card',
  E_WALLET: 'PhonePe Wallet',
};

export const AccountForm: React.FC<AccountFormProps> = ({ onSuccess, onClose }) => {
  const { data: existingAccounts = [] } = useAccounts();
  const { color: autoColor } = useAvailableColor();
  const { mutate: createAccount, isPending } = useCreateAccount(onSuccess);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isValid },
  } = useForm<CreateAccountInput>({
    resolver: zodResolver(createAccountSchema),
    mode: 'onChange',
    defaultValues: {
      name: 'HDFC Savings',
      type: 'BANK',
      balance: 0,
      currency: 'INR',
      color: autoColor,
      icon: 'landmark',
      includeInNetWorth: true,
      isArchived: false,
    },
  });

  const watchType = watch('type');
  const watchName = watch('name');
  const watchBalance = watch('balance');
  const watchColor = watch('color');

  // Auto assign color when hook returns it (e.g. on load)
  useEffect(() => {
    if (autoColor) {
      setValue('color', autoColor);
    }
  }, [autoColor, setValue]);

  // Update dynamic defaults (name, icon, balance fields) when Type switches
  useEffect(() => {
    // 1. Assign Icon
    const assignedIcon = ACCOUNT_ICONS[watchType] || 'landmark';
    setValue('icon', assignedIcon);

    // 2. Assign default Preset Name if current name is empty or matches a preset name
    const currentName = watchName?.trim();
    const isNamePreset = Object.values(PRESET_NAMES).includes(currentName) || !currentName;
    if (isNamePreset) {
      setValue('name', PRESET_NAMES[watchType]);
    }

    // 3. Setup balance overrides (outstanding balance for cards, initial investment for portfolios)
    if (watchType === 'CREDIT_CARD') {
      setValue('balance', 0);
      setValue('outstandingBalance', 0);
      setValue('creditLimit', 50000);
    } else if (watchType === 'INVESTMENT') {
      setValue('balance', 100000);
      setValue('interestRate', 10);
      setValue('investmentDuration', 5);
    } else {
      setValue('balance', 0);
    }
  }, [watchType, setValue]);

  // Handle outstanding Balance updates for Credit Cards
  const watchOutstanding = watch('outstandingBalance');
  useEffect(() => {
    if (watchType === 'CREDIT_CARD' && watchOutstanding !== undefined) {
      setValue('balance', -watchOutstanding);
    }
  }, [watchOutstanding, watchType, setValue]);

  const onSubmit = (data: CreateAccountInput) => {
    // Client-side duplicate check
    const isDuplicate = existingAccounts.some(
      (acc) => acc.name.toLowerCase() === data.name.toLowerCase()
    );
    if (isDuplicate) {
      setError('name', { type: 'manual', message: 'An account with this name already exists.' });
      // Scroll to name field
      const nameEl = document.getElementById('name');
      if (nameEl) {
        nameEl.focus();
        nameEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    createAccount(data as any);
  };

  const onError = (formErrors: any) => {
    // Automatically focus and scroll to the first invalid field
    const firstErrorKey = Object.keys(formErrors)[0];
    if (firstErrorKey) {
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const renderDynamicFields = () => {
    switch (watchType) {
      case 'BANK':
        return <BankFields register={register} errors={errors} isPending={isPending} />;
      case 'CASH':
        return <CashFields register={register} errors={errors} isPending={isPending} />;
      case 'CREDIT_CARD':
        return <CreditCardFields register={register} errors={errors} isPending={isPending} />;
      case 'INVESTMENT':
        return (
          <InvestmentFields
            register={register}
            errors={errors}
            isPending={isPending}
            setValue={setValue}
            watch={watch}
          />
        );
      case 'E_WALLET':
        return (
          <EWalletFields
            register={register}
            errors={errors}
            isPending={isPending}
            setValue={setValue}
            watch={watch}
          />
        );
      default:
        return null;
    }
  };

  const handleCloseAttempt = () => {
    if (!isPending) {
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col flex-grow overflow-hidden max-h-inherit"
    >
      {/* 1. Fixed Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Add New Account
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Create your financial account with dynamic presets.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCloseAttempt}
          disabled={isPending}
          className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all dark:hover:bg-gray-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 2. Scrollable Form Content */}
      <div className="p-6 overflow-y-auto flex-grow flex flex-col lg:flex-row gap-6 items-start">
        {/* Form Input fields */}
        <div className="flex-grow space-y-5 w-full">
          {/* Account Type Selector */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Account Type
            </label>
            <select
              id="type"
              disabled={isPending}
              {...register('type')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
            >
              <option value="BANK">Bank Account</option>
              <option value="CASH">Cash / Wallet</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="INVESTMENT">Investment Portfolio</option>
              <option value="E_WALLET">E-Wallet</option>
            </select>
          </div>

          {/* Dynamic Fields based on Type */}
          <div className="space-y-4">
            {renderDynamicFields()}
          </div>
        </div>

        {/* Live Preview (Desktop Only) */}
        <AccountPreview
          name={watchName}
          type={watchType}
          balance={watchBalance || 0}
          color={watchColor}
          currency="INR"
        />
      </div>

      {/* 3. Fixed Footer */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-[#12131a] flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCloseAttempt}
          disabled={isPending}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900 disabled:opacity-40 disabled:pointer-events-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !isValid}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </div>
    </form>
  );
};
export default AccountForm;
