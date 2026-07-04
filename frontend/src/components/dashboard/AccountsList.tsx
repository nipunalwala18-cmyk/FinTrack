import React from 'react';
import { Landmark, Wallet, CreditCard, PiggyBank, Smartphone, AlertCircle, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import type { Account } from '../../types/account';

interface AccountsListProps {
  accounts: Account[];
  onAddAccountClick: () => void;
}

export const AccountsList: React.FC<AccountsListProps> = ({ accounts, onAddAccountClick }) => {
  const getIcon = (type: string) => {
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
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Accounts</h3>
        <button
          onClick={onAddAccountClick}
          className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </button>
      </div>

      {accounts.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No accounts created yet.</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-50 bg-gray-50/20 dark:border-gray-800 dark:bg-gray-950/20 hover:bg-gray-50/50 dark:hover:bg-gray-950/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: account.color || '#2563EB' }}
                >
                  {getIcon(account.type)}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {account.name}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize font-medium">
                    {account.type.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="text-right pl-3 shrink-0">
                <p className={`text-sm font-black ${account.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                  {formatCurrency(account.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AccountsList;
