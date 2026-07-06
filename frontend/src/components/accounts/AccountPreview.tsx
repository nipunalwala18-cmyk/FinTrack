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
  color,
  currency,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'BANK':
        return <Landmark className="h-6 w-6 text-white" />;
      case 'CASH':
        return <Wallet className="h-6 w-6 text-white" />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-6 w-6 text-white" />;
      case 'INVESTMENT':
        return <PiggyBank className="h-6 w-6 text-white" />;
      case 'E_WALLET':
        return <Smartphone className="h-6 w-6 text-white" />;
      default:
        return <AlertCircle className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50/50 dark:bg-[#12131a]/40 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 w-64 text-center shrink-0 space-y-6 self-stretch">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Preview</span>
      
      <div className="space-y-4 flex flex-col items-center w-full">
        {/* Color Filled Icon Container */}
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300"
          style={{ backgroundColor: color }}
        >
          {getIcon()}
        </div>

        {/* Text Details */}
        <div className="space-y-1 w-full truncate">
          <h4 className="text-lg font-black text-gray-900 dark:text-white truncate">
            {name || 'HDFC Savings'}
          </h4>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 uppercase tracking-wider">
            {type.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Balance display */}
      <div className="space-y-0.5 border-t border-gray-100 dark:border-gray-800 w-full pt-4">
        <span className="text-[10px] font-semibold text-gray-400 uppercase">Balance</span>
        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">
          {formatCurrency(balance || 0)}
        </p>
      </div>
    </div>
  );
};
export default AccountPreview;
