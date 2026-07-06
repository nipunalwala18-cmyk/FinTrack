import React, { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { formatCurrency } from '../../utils/currency';
import { Target, TrendingUp, PiggyBank, ArrowDownRight, ArrowUpRight, BarChart2 } from 'lucide-react';
import type { Goal, GoalPeriod } from '../../types/goal';

export const GoalsAnalytics: React.FC = () => {
  const { data: goals = [], isLoading, isError } = useGoals();
  const [selectedPeriod, setSelectedPeriod] = useState<GoalPeriod>('MONTHLY');

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 space-y-6 animate-pulse h-96" />
    );
  }

  if (isError) {
    return null;
  }

  // Filter goals by period
  const periodGoals = goals.filter((g) => g.period === selectedPeriod);

  // Completion Rate
  const completed = periodGoals.filter((g) => g.status === 'COMPLETED').length;
  const total = periodGoals.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by Type
  const savingsGoals = periodGoals.filter((g) => g.goalType === 'SAVINGS');
  const expenseGoals = periodGoals.filter((g) => g.goalType === 'EXPENSE_LIMIT');
  const incomeGoals = periodGoals.filter((g) => g.goalType === 'INCOME_TARGET');

  const getSumStats = (filteredList: Goal[]) => {
    const target = filteredList.reduce((acc, g) => acc + g.targetAmount, 0);
    const current = filteredList.reduce((acc, g) => acc + Math.max(0, g.savedAmount), 0); // Cap negative savings at 0 for visual bar
    return { target, current };
  };

  const savingsStats = getSumStats(savingsGoals);
  const expenseStats = getSumStats(expenseGoals);
  const incomeStats = getSumStats(incomeGoals);

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header and Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-150 dark:border-gray-850">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Goals Performance Analytics</h2>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800/80 rounded-xl p-1 self-start sm:self-center">
          {(['WEEKLY', 'MONTHLY', 'YEARLY'] as GoalPeriod[]).map((period) => {
            const isActive = selectedPeriod === period;
            return (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Target className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No goals for this period</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Set up {selectedPeriod.toLowerCase()} goals to see analytics data.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Completion Rate (Donut Chart) */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Goal Completion Rate
            </h3>
            <div className="relative flex items-center justify-center h-44 w-44 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100 dark:text-gray-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-600 dark:text-purple-400"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center space-y-0.5">
                <p className="text-3xl font-black text-gray-900 dark:text-white">{completionRate}%</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Completed</p>
              </div>
            </div>
            <div className="text-center text-xs text-gray-400 font-semibold">
              {completed} of {total} goals completed successfully.
            </div>
          </div>

          {/* Savings Achieved / Income Target / Expense Limit Progress Bars */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 space-y-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Goal Performance By Category
            </h3>
            <div className="space-y-6">
              {/* Savings achieved vs target */}
              {savingsGoals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <PiggyBank className="h-4 w-4 text-purple-600" />
                      <span>Savings Target Achieved</span>
                    </div>
                    <span>
                      {formatCurrency(savingsStats.current)} / {formatCurrency(savingsStats.target)}
                    </span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-600 dark:bg-purple-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          savingsStats.target > 0 ? (savingsStats.current / savingsStats.target) * 100 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Income targets achieved */}
              {incomeGoals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      <span>Income Target Progress</span>
                    </div>
                    <span>
                      {formatCurrency(incomeStats.current)} / {formatCurrency(incomeStats.target)}
                    </span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          incomeStats.target > 0 ? (incomeStats.current / incomeStats.target) * 100 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Expense Limit Utilization */}
              {expenseGoals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4 text-rose-500" />
                      <span>Expense Limit Utilization</span>
                    </div>
                    <span>
                      {formatCurrency(expenseStats.current)} / {formatCurrency(expenseStats.target)}
                    </span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 dark:bg-rose-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          expenseStats.target > 0 ? (expenseStats.current / expenseStats.target) * 100 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress By Goal (List of all goals and progress bar) */}
          <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Individual Goal Progress Breakdown
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {periodGoals.map((goal) => {
                const progress = goal.progress || 0;
                const cappedProgress = Math.min(100, Math.max(0, progress));
                return (
                  <div key={goal.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1 text-left space-y-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {goal.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {goal.goalType && (
                          <>
                            <span className="font-semibold">{getGoalTypeLabel(goal.goalType)}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>
                          {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/3 flex items-center gap-3">
                      <div className="relative h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${cappedProgress}%`,
                            backgroundColor: goal.color || '#9333ea',
                          }}
                        />
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-white shrink-0 w-8 text-right">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getGoalTypeLabel = (type: string) => {
  switch (type) {
    case 'SAVINGS':
      return 'Savings';
    case 'EXPENSE_LIMIT':
      return 'Expense Limit';
    case 'INCOME_TARGET':
      return 'Income Target';
    default:
      return type;
  }
};

export default GoalsAnalytics;
