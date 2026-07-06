import React, { useState } from 'react';
import {
  Target,
  PiggyBank,
  TrendingUp,
  Wallet,
  Heart,
  Trophy,
  ShoppingBag,
  Car,
  Home,
  Gift,
  Compass,
  Coffee,
  PlusCircle,
  Search,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Play,
  XCircle,
  RotateCcw,
  Archive,
  ChevronDown,
  ChevronUp,
  History,
  TrendingDown
} from 'lucide-react';
import { useGoals, useUpdateGoalStatus } from '../../hooks/useGoals';
import { formatCurrency } from '../../utils/currency';
import GoalDialog from '../../components/goals/GoalDialog';
import DeleteGoalDialog from '../../components/goals/DeleteGoalDialog';
import type { Goal, GoalStatus } from '../../types/goal';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  PiggyBank,
  TrendingUp,
  Wallet,
  Heart,
  Trophy,
  ShoppingBag,
  Car,
  Home,
  Gift,
  Compass,
  Coffee,
};

export const GoalsPage: React.FC = () => {
  const { data: goals = [], isLoading, isError, error } = useGoals();
  const updateGoalStatus = useUpdateGoalStatus();

  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Expanded goal IDs for contribution history view
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [sortBy, setSortBy] = useState<string>('NEWEST');

  // Stats calculation
  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE').length;
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;
  const failedGoals = goals.filter((g) => g.status === 'FAILED').length;

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDialogOpen(true);
  };

  const handleDeleteClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDeleteOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedGoal(null);
    setIsGoalDialogOpen(true);
  };

  const handleArchiveClick = (goal: Goal) => {
    updateGoalStatus.mutate({ id: goal.id, status: 'ARCHIVED' });
  };

  const handleUnarchiveClick = (goal: Goal) => {
    updateGoalStatus.mutate({ id: goal.id, status: 'ACTIVE' });
  };

  const toggleHistory = (goalId: string) => {
    setExpandedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  // Filter & Sort Logic
  const filteredGoals = goals
    .filter((goal) => {
      const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || goal.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const getProgress = (g: Goal) =>
        g.targetAmount > 0 ? (g.savedAmount / g.targetAmount) : 0;

      switch (sortBy) {
        case 'OLDEST':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'HIGHEST_PROGRESS':
          return getProgress(b) - getProgress(a);
        case 'LOWEST_PROGRESS':
          return getProgress(a) - getProgress(b);
        case 'TARGET_AMOUNT':
          return b.targetAmount - a.targetAmount;
        case 'NEWEST':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/30">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/30">
            <XCircle className="h-3.5 w-3.5" />
            <span>Failed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/30">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/30">
            <Archive className="h-3.5 w-3.5" />
            <span>Archived</span>
          </span>
        );
      case 'ACTIVE':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/30">
            <Play className="h-3.5 w-3.5 fill-blue-700 dark:fill-blue-400 scale-[0.7]" />
            <span>Active</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full text-left animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Goals Funding & Progress
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track goal allocations and funding via explicit deposit and withdrawal transactions.
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/10 hover:bg-purple-700 active:scale-[0.98] transition-all self-start sm:self-center"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Goal</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Goals */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Total Goals</span>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{totalGoals}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Target className="h-5 w-5" />
          </div>
        </div>

        {/* Active Goals */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Active</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{activeGoals}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            <Play className="h-5 w-5 fill-blue-600 dark:fill-blue-400 scale-[0.8]" />
          </div>
        </div>

        {/* Completed Goals */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Completed</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {completedGoals}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Failed Goals */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Failed</span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{failedGoals}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals by name..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-950 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-950 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold"
          >
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="HIGHEST_PROGRESS">Highest Progress</option>
            <option value="LOWEST_PROGRESS">Lowest Progress</option>
            <option value="TARGET_AMOUNT">Highest Target</option>
          </select>
        </div>
      </div>

      {/* Goal Cards List */}
      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-white border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center space-y-2">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
            <p className="text-sm font-semibold text-gray-500">
              {error?.message || 'Failed to fetch goals'}
            </p>
          </div>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 space-y-4 max-w-md mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Target className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No goals found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {goals.length === 0
                ? 'Create a goal and allocate transactions to start saving!'
                : 'Try adjusting your filter options.'}
            </p>
          </div>
          {goals.length === 0 && (
            <button
              onClick={handleCreateClick}
              className="mx-auto flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 active:scale-[0.98] transition-all"
            >
              <span>Add Goal</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {filteredGoals.map((goal) => {
            const IconComponent = ICON_MAP[goal.icon || 'Target'] || Target;
            const themeColor = goal.color || '#9333ea';
            const progress = goal.progress || 0;
            const remaining = goal.remainingAmount;
            const isExpanded = !!expandedGoals[goal.id];

            return (
              <div
                key={goal.id}
                className="relative rounded-2xl bg-white border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                {/* Visual Theme Line */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: themeColor }}
                />

                {/* Card Top */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                        style={{ backgroundColor: themeColor }}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white line-clamp-1">
                          {goal.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Target: {new Date(goal.targetDate || goal.endDate || '').toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>

                  {goal.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-left line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Progress Details */}
                <div className="space-y-4 pt-6">
                  <div className="flex items-end justify-between">
                    <div className="text-left space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Current Saved / Target
                      </span>
                      <p className="text-lg font-black text-gray-900 dark:text-white">
                        {formatCurrency(goal.savedAmount)}{' '}
                        <span className="text-xs font-bold text-gray-400">
                          / {formatCurrency(goal.targetAmount)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Completion
                      </span>
                      <p className="text-lg font-black text-purple-600 dark:text-purple-400">
                        {Math.round(progress)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="relative h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: themeColor,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase">
                      <span>{formatCurrency(remaining)} remaining</span>
                      {goal.lastContributionDate && (
                        <span>
                          Last contribution:{' '}
                          {new Date(goal.lastContributionDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contribution History Collapsible section */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-850/80">
                  <button
                    onClick={() => toggleHistory(goal.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>Contribution History ({goal.transactions?.length || 0})</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 space-y-2 max-h-40 overflow-y-auto pr-1">
                      {!goal.transactions || goal.transactions.length === 0 ? (
                        <p className="text-[11px] text-gray-400 font-semibold py-1 text-left">
                          No contributions recorded yet. Link a transaction to get started.
                        </p>
                      ) : (
                        goal.transactions.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-850"
                          >
                            <div className="min-w-0 text-left space-y-0.5">
                              <p className="font-bold text-gray-700 dark:text-gray-300 truncate">
                                {t.description || 'Contribution'}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium">
                                {new Date(t.date).toLocaleDateString()} • {t.account?.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {t.contributionType === 'DEPOSIT' ? (
                                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-black">
                                  <ArrowRight className="h-3 w-3 rotate-45 mr-0.5" />
                                  +{formatCurrency(t.amount)}
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-black">
                                  <ArrowRight className="h-3 w-3 -rotate-45 mr-0.5" />
                                  -{formatCurrency(t.amount)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Hover Controls */}
                <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {goal.status === 'ARCHIVED' ? (
                    <button
                      onClick={() => handleUnarchiveClick(goal)}
                      title="Activate goal"
                      className="rounded-lg p-1.5 bg-white border border-gray-150 shadow-sm text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:bg-gray-900 dark:border-gray-850 dark:text-gray-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/20 transition-all active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchiveClick(goal)}
                      title="Archive goal"
                      className="rounded-lg p-1.5 bg-white border border-gray-150 shadow-sm text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:bg-gray-900 dark:border-gray-850 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/20 transition-all active:scale-95"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(goal)}
                    className="rounded-lg p-1.5 bg-white border border-gray-150 shadow-sm text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:bg-gray-900 dark:border-gray-850 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-950/20 transition-all active:scale-95"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(goal)}
                    className="rounded-lg p-1.5 bg-white border border-gray-150 shadow-sm text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:bg-gray-900 dark:border-gray-850 dark:text-gray-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-all active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <GoalDialog
        isOpen={isGoalDialogOpen}
        onClose={() => setIsGoalDialogOpen(false)}
        goalItem={selectedGoal}
      />

      <DeleteGoalDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        goalId={selectedGoal ? selectedGoal.id : null}
        goalName={selectedGoal ? selectedGoal.name : ''}
      />
    </div>
  );
};

const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default GoalsPage;
