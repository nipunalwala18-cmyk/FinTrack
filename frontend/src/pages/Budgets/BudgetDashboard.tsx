import React, { useState } from 'react';
import { Plus, Wallet, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { useBudgetDashboard, useDeleteBudget } from '../../hooks/useBudgets';
import { BudgetTabs } from '../../components/budgets/BudgetTabs';
import { BudgetSummary } from '../../components/budgets/BudgetSummary';
import { BudgetChart } from '../../components/budgets/BudgetChart';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { BudgetFormModal } from '../../components/budgets/BudgetFormModal';
import type { BudgetDashboardItem, BudgetPeriod } from '../../types/budget';

export const BudgetDashboard: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<BudgetPeriod>('MONTHLY');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetDashboardItem | null>(null);

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
    if (window.confirm('Are you sure you want to delete this budget limit?')) {
      deleteBudget.mutate(id);
    }
  };

  return (
    <div className="w-full space-y-6 max-w-7xl mx-auto p-4 sm:p-6 text-left">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Budgets
            {isFetching && (
              <RefreshCw className="h-5 w-5 text-purple-650 dark:text-purple-400 animate-spin" />
            )}
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Monitor limits, manage expenditures, and tracking allocations.
          </p>
        </div>

        {/* Add Budget trigger button */}
        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-650 px-5 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/10 hover:bg-purple-700 active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Budget
        </button>
      </div>

      {/* 2. Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-gray-400">Loading budget statistics...</span>
        </div>
      ) : error ? (
        /* Error State */
        <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-950/10 flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h3 className="font-extrabold text-red-800 dark:text-red-400">Failed to load budgets</h3>
          <p className="text-xs text-red-600/80 dark:text-red-400/80 max-w-sm text-center">
            {error instanceof Error ? error.message : 'An error occurred while loading dashboard metrics.'}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-all cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        /* Actual Dashboard content */
        <div className="space-y-6 animate-fade-in">
          {/* Period selector tabs */}
          <div className="flex justify-start">
            <BudgetTabs activePeriod={activePeriod} onChange={setActivePeriod} />
          </div>

          {dashboardData.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600">
                <Wallet className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Create a budget</h3>
                <p className="text-sm text-gray-400 font-medium max-w-xs">
                  Establish a weekly, monthly, or yearly limit for an expense category to begin.
                </p>
              </div>
              <button
                onClick={handleCreateClick}
                className="flex items-center gap-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 px-4.5 py-2.5 text-xs font-bold text-purple-650 dark:text-purple-400 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Budget
              </button>
            </div>
          ) : (
            <>
              {/* Summary Cards Panel */}
              <BudgetSummary data={dashboardData} />

              {/* Charts Panel */}
              <BudgetChart data={dashboardData} />

              {/* Grid cards display */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Active Limits</h3>
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
    </div>
  );
};
export default BudgetDashboard;
