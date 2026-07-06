import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle, AlertTriangle, ArrowRight, Play, Compass } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import { formatCurrency } from '../../utils/currency';
import type { Goal } from '../../types/goal';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Compass,
};

export const GoalsOverviewWidget: React.FC = () => {
  const { data: goals = [], isLoading, isError } = useGoals();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 space-y-4 animate-pulse h-96" />
    );
  }

  if (isError) {
    return null; // Fail silently or display simple error inside dashboard
  }

  // Calculations
  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE').length;
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;
  const failedGoals = goals.filter((g) => g.status === 'FAILED').length;

  // Overall Progress
  // Sum of achieved progress percentages of all ACTIVE / COMPLETED goals / number of goals
  const activeOrCompleted = goals.filter((g) => g.status === 'ACTIVE' || g.status === 'COMPLETED');
  const overallProgress =
    activeOrCompleted.length > 0
      ? Math.round(
          activeOrCompleted.reduce((acc, g) => {
            const p = g.targetAmount > 0 ? (g.savedAmount / g.targetAmount) * 100 : 0;
            return acc + Math.min(100, Math.max(0, p));
          }, 0) / activeOrCompleted.length
        )
      : 0;

  // Top 3 goals closest to completion (status ACTIVE, sorted by progress desc)
  const topGoals = goals
    .filter((g) => g.status === 'ACTIVE')
    .map((g) => {
      const p = g.targetAmount > 0 ? (g.savedAmount / g.targetAmount) * 100 : 0;
      return { goal: g, progress: Math.min(100, Math.max(0, p)) };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  // Alerts for overdue or failed goals
  const overdueAlerts = goals.filter(
    (g) => g.status === 'FAILED' || (g.status === 'ACTIVE' && new Date() > new Date(g.targetDate))
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 space-y-6 flex flex-col justify-between h-full min-h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-left">
          <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Goals Overview</h3>
        </div>
        <button
          onClick={() => navigate('/goals')}
          className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {totalGoals === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Target className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">No goals set yet</h4>
            <p className="text-xs text-gray-400 max-w-[200px]">
              Set financial targets to save money and limit expenses.
            </p>
          </div>
          <button
            onClick={() => navigate('/goals')}
            className="rounded-xl bg-purple-600/10 px-4 py-2 text-xs font-bold text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 hover:bg-purple-600/20 active:scale-95 transition-all"
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between space-y-6">
          {/* Main Grid: Overall Progress + Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* Radial / Progress Ring */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-500/[0.02] border border-purple-500/10">
              <div className="relative flex items-center justify-center h-20 w-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100 dark:text-gray-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600 dark:text-purple-400"
                    strokeWidth="3.5"
                    strokeDasharray={`${overallProgress}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black text-gray-900 dark:text-white">
                  {overallProgress}%
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 text-center">
                Overall Progress
              </span>
            </div>

            {/* Quick Stats list */}
            <div className="grid grid-rows-2 gap-2 text-left justify-center">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                  <Play className="h-3.5 w-3.5 fill-blue-600 dark:fill-blue-400 scale-[0.7]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase leading-none">Active</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                    {activeGoals}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase leading-none">Completed</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                    {completedGoals}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Active Goals Closest to Completion */}
          {topGoals.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">
                Closest to Completion
              </h4>
              <div className="space-y-2.5">
                {topGoals.map(({ goal, progress }) => {
                  const themeColor = goal.color || '#9333ea';
                  return (
                    <div
                      key={goal.id}
                      onClick={() => navigate('/goals')}
                      className="flex flex-col gap-1.5 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-700 dark:text-gray-300 line-clamp-1">
                          {goal.name}
                        </span>
                        <span className="font-black text-purple-600 dark:text-purple-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="relative h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-850 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%`, backgroundColor: themeColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alerts for overdue or failed goals */}
          {overdueAlerts.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 text-left">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 leading-tight">
                {overdueAlerts.length} goal{overdueAlerts.length > 1 ? 's' : ''} failed or overdue. Check dates on the Goals page.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsOverviewWidget;
