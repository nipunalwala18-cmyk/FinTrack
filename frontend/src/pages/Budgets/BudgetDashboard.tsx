import React, { useState } from 'react';
import { Plus, Wallet, AlertCircle, RefreshCw } from 'lucide-react';
import { useBudgetDashboard, useDeleteBudget } from '../../hooks/useBudgets';
import { BudgetTabs } from '../../components/budgets/BudgetTabs';
import { BudgetSummary } from '../../components/budgets/BudgetSummary';
import { BudgetChart } from '../../components/budgets/BudgetChart';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { BudgetFormModal } from '../../components/budgets/BudgetFormModal';
import { ConfirmationDialog } from '../../components/layout/ConfirmationDialog';
import type { BudgetDashboardItem, BudgetPeriod } from '../../types/budget';

export const BudgetDashboard: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<BudgetPeriod>('MONTHLY');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetDashboardItem | null>(null);

  // Custom confirmation dialog state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: dashboardData = [], isLoading, error, refetch, isFetching } = useBudgetDashboard(activePeriod);
  const deleteBudget = useDeleteBudget();

  const handleEditClick = (item: BudgetDashboardItem) => {
    setEditingBudget(item);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteBudget.mutate(confirmDeleteId, {
        onSuccess: () => {
          setConfirmDeleteId(null);
        },
      });
    }
  };

  return (
    <div className="w-full space-y-5 text-left animate-fade-in">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            Budgets
            {isFetching && (
              <RefreshCw className="h-5 w-5 text-white/50 animate-spin" />
            )}
          </h1>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Monitor limits, manage expenditures, and tracking allocations.
          </p>
        </div>

        {/* Add Budget trigger button */}
        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-5 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer self-start sm:self-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* 2. Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-semibold text-white/40 uppercase tracking-wider">Loading budget stats...</span>
        </div>
      ) : error ? (
        /* Error State */
        <div
          className="p-8 text-center space-y-4 max-w-md mx-auto"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(248,113,113,0.25)',
            borderRadius: 16,
          }}
        >
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(248,113,113,0.08)' }}
          >
            <AlertCircle className="h-6 w-6 text-rose-450" />
          </div>
          <h3 className="font-bold text-white">Failed to load budgets</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            {error instanceof Error ? error.message : 'An error occurred while loading dashboard metrics.'}
          </p>
          <button
            onClick={() => refetch()}
            className="w-full py-2 bg-white text-black hover:bg-white/90 active:scale-[0.98] rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        /* Actual Dashboard content */
        <div className="space-y-6">
          {/* Period selector tabs */}
          <div className="flex justify-start">
            <BudgetTabs activePeriod={activePeriod} onChange={setActivePeriod} />
          </div>

          {dashboardData.length === 0 ? (
            /* Empty State */
            <div
              className="p-12 text-center max-w-md mx-auto space-y-5"
              style={{
                background: '#0a0a0a',
                border: '0.5px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
              }}
            >
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <Wallet className="h-7 w-7 text-white/60" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Create a budget</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Establish a weekly, monthly, or yearly limit for an expense category to begin.
                </p>
              </div>
              <button
                onClick={handleCreateClick}
                className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
              >
                Create Budget
              </button>
            </div>
          ) : (
            <>
              {/* Summary Cards Panel */}
              <BudgetSummary data={dashboardData} />

              {/* Charts Panel */}
              <BudgetChart data={dashboardData} />

              {/* Grid cards display */}
              <div className="space-y-3 pt-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Active Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      item={budget}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Form Dialog Modal */}
      <BudgetFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBudget(null);
        }}
        budgetItem={editingBudget}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!confirmDeleteId}
        title="Delete Budget Limit"
        description="Are you sure you want to delete this budget limit? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isPending={deleteBudget.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
export default BudgetDashboard;
