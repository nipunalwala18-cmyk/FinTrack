import React from 'react';
import { Landmark, Wallet, CreditCard, PiggyBank, Smartphone, AlertCircle } from 'lucide-react';
import type { AccountType } from '../../../types/account';

interface SharedFieldsProps {
  type: AccountType;
  color: string;
  currency: string;
}

export const SharedFields: React.FC<SharedFieldsProps> = ({ type, color, currency }) => {
  const getIcon = () => {
    switch (type) {
      case 'BANK':
        return <Landmark className="h-5 w-5" />;
      case 'CASH':
        return <Wallet className="h-5 w-5" />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-5 w-5" />;
      case 'INVESTMENT':
        return <PiggyBank className="h-5 w-5" />;
      case 'E_WALLET':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid gap-4 grid-cols-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 dark:bg-gray-900/30 dark:border-gray-800 text-left">
      {/* Currency */}
      <div className="space-y-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Currency</span>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{currency}</p>
      </div>

      {/* Auto Assigned Theme Color */}
      <div className="space-y-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Theme Color</span>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: color }} />
          <span className="text-xs font-mono text-gray-500">{color}</span>
        </div>
      </div>

      {/* Auto Selected Icon */}
      <div className="space-y-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Icon Assigned</span>
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          {getIcon()}
          <span className="text-xs capitalize">{type.toLowerCase().replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};
export default SharedFields;
