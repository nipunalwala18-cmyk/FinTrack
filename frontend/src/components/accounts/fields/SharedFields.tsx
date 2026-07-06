import React from 'react';
import { Landmark, Wallet, CreditCard, PiggyBank, Smartphone, AlertCircle } from 'lucide-react';
import type { AccountType } from '../../../types/account';
import { LABEL_CLS, LABEL_STYLE } from '../fieldStyles';

interface SharedFieldsProps {
  type: AccountType;
  color: string;
  currency: string;
}

export const SharedFields: React.FC<SharedFieldsProps> = ({ type, color, currency }) => {
  const getIcon = () => {
    switch (type) {
      case 'BANK':        return <Landmark className="h-5 w-5" />;
      case 'CASH':        return <Wallet className="h-5 w-5" />;
      case 'CREDIT_CARD': return <CreditCard className="h-5 w-5" />;
      case 'INVESTMENT':  return <PiggyBank className="h-5 w-5" />;
      case 'E_WALLET':    return <Smartphone className="h-5 w-5" />;
      default:            return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div
      className="grid gap-4 grid-cols-3 p-4 rounded-xl text-left"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Currency */}
      <div className="space-y-1">
        <span className={LABEL_CLS} style={LABEL_STYLE}>Currency</span>
        <p className="text-sm font-semibold" style={{ color: '#fff' }}>{currency}</p>
      </div>

      {/* Auto Assigned Theme Color */}
      <div className="space-y-1">
        <span className={LABEL_CLS} style={LABEL_STYLE}>Theme Color</span>
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color, border: '1px solid rgba(255,255,255,0.15)' }}
          />
          <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{color}</span>
        </div>
      </div>

      {/* Auto Selected Icon */}
      <div className="space-y-1">
        <span className={LABEL_CLS} style={LABEL_STYLE}>Icon Assigned</span>
        <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {getIcon()}
          <span className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {type.toLowerCase().replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};
export default SharedFields;
