import React, { useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAccounts } from '../../hooks/useAccounts';
import { WelcomeCard } from '../../components/dashboard/WelcomeCard';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { MonthStatistics } from '../../components/dashboard/MonthStatistics';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { AccountsList, GoalsOverviewWidget, DashboardAIAssistantCard } from '../../components/dashboard';
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
        <div
          className="rounded-2xl p-8 max-w-md w-full text-center space-y-6"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(248,113,113,0.25)',
          }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(248,113,113,0.08)' }}
          >
            <AlertCircle className="h-7 w-7" style={{ color: 'rgba(248,113,113,0.8)' }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>
              Unable to load dashboard
            </h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {error?.message || 'An unexpected error occurred while fetching financial statistics.'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]"
            style={{ background: '#fff', color: '#000' }}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {data && (
        <>
          {/* Welcome row + optional Add Account button */}
          <div className="flex items-center justify-between gap-4 pb-5 shrink-0" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
            <WelcomeCard name={data.user.name} />
            {!isEmptyState && (
              <button
                onClick={() => setIsAddAccountOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                style={{ background: '#fff', color: '#000' }}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Account</span>
              </button>
            )}
          </div>

          {isEmptyState ? (
            /* ── Empty state ── */
            <div className="flex items-center justify-center py-12 flex-grow">
              <div
                className="rounded-2xl p-8 max-w-md w-full text-center space-y-6"
                style={{
                  background: '#0a0a0a',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                }}
              >
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <PlusCircle className="h-7 w-7" style={{ color: 'rgba(255,255,255,0.6)' }} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>
                    No financial data yet
                  </h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Start by adding your first account to begin tracking balances, savings, and monthly
                    spendings.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddAccountOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]"
                  style={{ background: '#fff', color: '#000' }}
                >
                  <span>Add Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── Dashboard content ── */
            <div className="flex flex-col gap-4">
              {/* 4-column stat grid */}
              <div>
                <SummaryCards summary={data.summary} />
              </div>

              {/* Bottom rows grid container */}
              <div className="space-y-4">
                {/* Row 1: MonthStatistics (2cols) + AccountsList (1col) */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 lg:items-stretch">
                  <div className="lg:col-span-2 flex flex-col">
                    <MonthStatistics stats={data.currentMonth} />
                  </div>
                  <div className="flex flex-col">
                    <AccountsList
                      accounts={accounts}
                      onAddAccountClick={() => setIsAddAccountOpen(true)}
                    />
                  </div>
                </div>

                {/* Row 2: AI Assistant card (2cols) + GoalsOverviewWidget (1col) */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 lg:items-stretch">
                  <div className="lg:col-span-2 flex flex-col">
                    <DashboardAIAssistantCard />
                  </div>
                  <div className="flex flex-col">
                    <GoalsOverviewWidget />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Account Modal Dialog */}
      <AddAccountDialog isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} />
    </div>
  );
};
export default DashboardPage;
