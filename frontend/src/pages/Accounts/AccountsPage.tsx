import React, { useState } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountsList } from '../../components/dashboard/AccountsList';
import { AddAccountDialog } from '../../components/accounts/AddAccountDialog';
import { PlusCircle, Wallet, Loader2 } from 'lucide-react';

export const AccountsPage: React.FC = () => {
  const { data: accounts = [], isLoading, isError, refetch } = useAccounts();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Account Management</h2>
          <p className="text-sm text-gray-400 font-medium">Manage and view all your active financial accounts</p>
        </div>
        <button
          onClick={() => setIsAddAccountOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/10 hover:bg-purple-700 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Account</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/20 p-8 text-center dark:border-red-950/20">
          <p className="text-sm text-red-500 font-bold">Failed to load accounts. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-3xl border border-gray-150 bg-white p-12 text-center dark:border-gray-800 dark:bg-[#12131a] max-w-md mx-auto space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Wallet className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">No accounts found</h3>
            <p className="text-sm text-gray-400">Add a bank, credit card, e-wallet, or cash account to get started.</p>
          </div>
          <button
            onClick={() => setIsAddAccountOpen(true)}
            className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-500/15"
          >
            Create Your First Account
          </button>
        </div>
      ) : (
        <div className="max-w-3xl">
          <AccountsList accounts={accounts} onAddAccountClick={() => setIsAddAccountOpen(true)} />
        </div>
      )}

      <AddAccountDialog isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} />
    </div>
  );
};
export default AccountsPage;
