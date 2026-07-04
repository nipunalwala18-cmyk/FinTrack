import React, { useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAccounts } from '../../hooks/useAccounts';
import { WelcomeCard } from '../../components/dashboard/WelcomeCard';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { MonthStatistics } from '../../components/dashboard/MonthStatistics';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { AccountsList } from '../../components/dashboard/AccountsList';
import { AddAccountDialog } from '../../components/accounts/AddAccountDialog';
import { RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data, isLoading: isDashboardLoading, isError, error, refetch } = useDashboard();
  const { data: accounts = [], isLoading: isAccountsLoading } = useAccounts();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const isLoading = isDashboardLoading || isAccountsLoading;

  // Empty state is active if the user has no accounts configured
  const isEmptyState = accounts.length === 0;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-[#12131a] border border-red-100 dark:border-red-950/20 max-w-md w-full text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/20">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Unable to load dashboard
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {error?.message || 'An unexpected error occurred while fetching financial statistics.'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full text-left">
      {data && (
        <>
          {/* Welcome Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <WelcomeCard name={data.user.name} />
            {!isEmptyState && (
              <button
                onClick={() => setIsAddAccountOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/10 hover:bg-purple-700 active:scale-[0.98] transition-all self-start sm:self-center"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Account</span>
              </button>
            )}
          </div>

          {isEmptyState ? (
            // Empty State
            <div className="flex items-center justify-center py-12">
              <div className="rounded-3xl bg-white p-8 shadow-md dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 max-w-md w-full text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
                  <PlusCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    No financial data yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start by adding your first account to begin tracking balances, savings, and monthly spendings.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddAccountOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-[0.98]"
                >
                  <span>Add Account</span>
                </button>
              </div>
            </div>
          ) : (
            // Dashboard Content
            <>
              {/* 4 Summary Cards */}
              <SummaryCards summary={data.summary} />

              {/* Grid layout for Statistics & Accounts list */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start">
                <div className="lg:col-span-2">
                  <MonthStatistics stats={data.currentMonth} />
                </div>
                <div>
                  <AccountsList accounts={accounts} onAddAccountClick={() => setIsAddAccountOpen(true)} />
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Add Account Modal Dialog */}
      <AddAccountDialog isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} />
    </div>
  );
};
export default DashboardPage;
