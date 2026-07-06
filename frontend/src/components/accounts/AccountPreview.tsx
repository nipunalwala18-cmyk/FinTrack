import React from 'react';
import { Landmark, Wallet, CreditCard, PiggyBank, Smartphone, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import type { AccountType } from '../../types/account';

interface AccountPreviewProps {
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  currency: string;
}

export const AccountPreview: React.FC<AccountPreviewProps> = ({
  name,
  type,
  balance,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'BANK':
        return <Landmark className="h-6 w-6" style={{ color: '#000' }} />;
      case 'CASH':
        return <Wallet className="h-6 w-6" style={{ color: '#000' }} />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-6 w-6" style={{ color: '#000' }} />;
      case 'INVESTMENT':
        return <PiggyBank className="h-6 w-6" style={{ color: '#000' }} />;
      case 'E_WALLET':
        return <Smartphone className="h-6 w-6" style={{ color: '#000' }} />;
      default:
        return <AlertCircle className="h-6 w-6" style={{ color: '#000' }} />;
    }
  };

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center p-8 w-64 text-center shrink-0 space-y-6 self-stretch"
      style={{
        background: '#0d0d0d',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
      }}
    >
      {/* Panel label */}
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Live Preview
      </span>

      <div className="space-y-4 flex flex-col items-center w-full">
        {/*
         * Icon badge: solid white square (10px radius), black icon inside.
         * Monochrome — differentiating by icon shape rather than color,
         * matching StatCard icon treatment and sidebar active state.
         * The account-type icon map (Landmark / Wallet / CreditCard /
         * PiggyBank / Smartphone) provides adequate visual differentiation
         * without needing per-type colors.
         */}
        <div
          className="h-14 w-14 flex items-center justify-center transition-all duration-300"
          style={{ background: '#fff', borderRadius: 10 }}
        >
          {getIcon()}
        </div>

        {/* Name & type badge */}
        <div className="space-y-2 w-full">
          <h4 className="text-base font-medium truncate" style={{ color: '#fff' }}>
            {name || 'HDFC Savings'}
          </h4>
          <span
            className="inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            {type.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Balance section — separated by hairline */}
      <div
        className="space-y-1 w-full pt-4 text-center"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <span
          className="block text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Balance
        </span>
        <p className="text-2xl font-medium tracking-tight truncate" style={{ color: '#fff' }}>
          {formatCurrency(balance || 0)}
        </p>
      </div>
    </div>
  );
};
export default AccountPreview;
