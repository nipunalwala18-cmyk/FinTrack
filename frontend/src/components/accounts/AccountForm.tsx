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
  } = useForm<any>({
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
    const assignedIcon = ACCOUNT_ICONS[watchType as keyof typeof ACCOUNT_ICONS] || 'landmark';
    setValue('icon', assignedIcon);

    // 2. Assign default Preset Name if current name is empty or matches a preset name
    const currentName = watchName?.trim();
    const isNamePreset = Object.values(PRESET_NAMES).includes(currentName) || !currentName;
    if (isNamePreset) {
      setValue('name', PRESET_NAMES[watchType as keyof typeof PRESET_NAMES]);
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
    if (watchType === 'CREDIT_CARD' && watchOutstanding !== undefined && watchOutstanding !== null) {
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
      <div
        className="px-6 py-5 flex items-center justify-between shrink-0"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <div className="space-y-1 text-left">
          <h2 className="text-xl font-medium" style={{ color: '#fff' }}>
            Add New Account
          </h2>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Create your financial account with dynamic presets.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCloseAttempt}
          disabled={isPending}
          className="rounded-xl p-2 transition-all disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 2. Scrollable Form Content */}
      <div className="p-6 overflow-y-auto flex-grow flex flex-col lg:flex-row gap-6 items-start scrollbar-hidden">
        {/* Form Input fields */}
        <div className="flex-grow space-y-5 w-full">
          {/* Account Type Selector */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="type"
              className="text-xs font-semibold uppercase tracking-wider block"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Account Type
            </label>
            <select
              id="type"
              disabled={isPending}
              {...register('type')}
              className="w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none appearance-none"
              style={{
                background: '#141414',
                border: '0.5px solid rgba(255,255,255,0.14)',
                borderRadius: 8,
                color: '#fff',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
            >
              <option value="BANK" style={{ background: '#141414' }}>Bank Account</option>
              <option value="CASH" style={{ background: '#141414' }}>Cash / Wallet</option>
              <option value="CREDIT_CARD" style={{ background: '#141414' }}>Credit Card</option>
              <option value="INVESTMENT" style={{ background: '#141414' }}>Investment Portfolio</option>
              <option value="E_WALLET" style={{ background: '#141414' }}>E-Wallet</option>
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
      <div
        className="px-6 py-4 shrink-0 flex justify-end gap-3"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <button
          type="button"
          onClick={handleCloseAttempt}
          disabled={isPending}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
          style={{
            background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.18)',
            color: '#fff',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !isValid}
          className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          style={{ background: '#fff', color: '#000' }}
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
