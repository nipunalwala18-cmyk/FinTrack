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
        return <Landmark className="h-4 w-4" />;
      case 'CASH':
        return <Wallet className="h-4 w-4" />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-4 w-4" />;
      case 'INVESTMENT':
        return <PiggyBank className="h-4 w-4" />;
      case 'E_WALLET':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div
      className="w-full h-full rounded-2xl p-5 space-y-4"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between pb-3"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: '#fff' }}>
          My Accounts
        </h3>
        <button
          onClick={onAddAccountClick}
          className="flex items-center gap-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </button>
      </div>

      {accounts.length === 0 ? (
        <p className="text-xs py-4 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
          No accounts created yet.
        </p>
      ) : (
        /* max-h limits to ~4 items before internal scroll kicks in */
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-xl transition-colors"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Account icon tile — solid white background, black icon inside */}
                <div
                  className="h-8 w-8 flex items-center justify-center shrink-0"
                  style={{ background: '#fff', borderRadius: 8, color: '#000' }}
                >
                  {getIcon(account.type)}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#fff' }}>
                    {account.name}
                  </p>
                  <p
                    className="text-[10px] capitalize font-medium"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {account.type.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="text-right pl-3 shrink-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: account.balance < 0 ? 'rgba(248,113,113,0.85)' : '#fff' }}
                >
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
