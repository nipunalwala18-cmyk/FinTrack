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
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3" />
            <span>Failed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-white/50 border border-white/10">
            <RotateCcw className="h-3 w-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Archive className="h-3 w-3" />
            <span>Archived</span>
          </span>
        );
      case 'ACTIVE':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Play className="h-3 w-3 fill-blue-400 scale-[0.7]" />
            <span>Active</span>
          </span>
        );
    }
  };

  const getProgressBarColor = (status: GoalStatus) => {
    switch (status) {
      case 'COMPLETED':
        return '#10b981'; // Green
      case 'FAILED':
        return '#ef4444'; // Red
      case 'CANCELLED':
        return '#6b7280'; // Gray
      case 'ARCHIVED':
        return '#f59e0b'; // Orange/Amber
      case 'ACTIVE':
      default:
        return '#3b82f6'; // Blue
    }
  };

  return (
    <div className="space-y-5 w-full text-left animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Goals Funding & Progress
          </h1>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Track goal allocations and funding via explicit deposit and withdrawal transactions.
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-5 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer self-start sm:self-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Goal</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Goals */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Total Goals</span>
            <p className="text-2xl font-semibold text-white">{totalGoals}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white border border-white/10">
            <Target className="h-5 w-5" />
          </div>
        </div>

        {/* Active Goals */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Active</span>
            <p className="text-2xl font-semibold text-blue-400">{activeGoals}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Play className="h-5 w-5 fill-blue-400 scale-[0.8]" />
          </div>
        </div>

        {/* Completed Goals */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Completed</span>
            <p className="text-2xl font-semibold text-emerald-400">{completedGoals}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Failed Goals */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Failed</span>
            <p className="text-2xl font-semibold text-rose-400">{failedGoals}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters & Sorting Toolbar */}
      <div
        className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
        }}
      >
        {/* Search */}
        <div className="relative w-full sm:max-w-xs text-left">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/40">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals..."
            className="w-full pl-9 pr-4 py-2 text-sm transition-all focus:outline-none"
            style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#fff',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs transition-all focus:outline-none appearance-none cursor-pointer"
            style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#fff',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            <option value="ALL" style={{ background: '#141414' }}>All Statuses</option>
            <option value="ACTIVE" style={{ background: '#141414' }}>Active</option>
            <option value="COMPLETED" style={{ background: '#141414' }}>Completed</option>
            <option value="FAILED" style={{ background: '#141414' }}>Failed</option>
            <option value="CANCELLED" style={{ background: '#141414' }}>Cancelled</option>
            <option value="ARCHIVED" style={{ background: '#141414' }}>Archived</option>
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs transition-all focus:outline-none appearance-none cursor-pointer"
            style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#fff',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            <option value="NEWEST" style={{ background: '#141414' }}>Newest</option>
            <option value="OLDEST" style={{ background: '#141414' }}>Oldest</option>
            <option value="HIGHEST_PROGRESS" style={{ background: '#141414' }}>Highest Progress</option>
            <option value="LOWEST_PROGRESS" style={{ background: '#141414' }}>Lowest Progress</option>
            <option value="TARGET_AMOUNT" style={{ background: '#141414' }}>Highest Target</option>
          </select>
        </div>
      </div>

      {/* Goal Cards List */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl animate-pulse"
              style={{
                background: '#0a0a0a',
                border: '0.5px solid rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center space-y-2">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
            <p className="text-sm font-semibold text-white/50">
              {error?.message || 'Failed to fetch goals'}
            </p>
          </div>
        </div>
      ) : filteredGoals.length === 0 ? (
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
            <Target className="h-7 w-7 text-white/60" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">No goals found</h3>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {goals.length === 0
                ? 'Create a goal and allocate transactions to start saving!'
                : 'Try adjusting your filter options.'}
            </p>
          </div>
          {goals.length === 0 && (
            <button
              onClick={handleCreateClick}
              className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
            >
              Add Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {filteredGoals.map((goal) => {
            const IconComponent = ICON_MAP[goal.icon || 'Target'] || Target;
            const themeColor = goal.color || '#9333ea';
            const progress = goal.progress || 0;
            const remaining = goal.remainingAmount;
            const isExpanded = !!expandedGoals[goal.id];

            return (
              <div
                key={goal.id}
                className="relative p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group overflow-hidden"
                style={{
                  background: '#0a0a0a',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  borderRadius: 16,
                }}
              >
                {/* Visual Theme Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: themeColor }}
                />

                {/* Card Top */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm shrink-0"
                        style={{ backgroundColor: themeColor }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5 text-left min-w-0">
                        <h3 className="text-base font-bold text-white truncate">
                          {goal.name}
                        </h3>
                        <p className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 text-white/40">
                          <Calendar className="h-3.5 w-3.5" />
                          Target: {new Date(goal.targetDate || goal.endDate || '').toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(goal.status)}
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-white/50 text-left line-clamp-2 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Progress Details */}
                <div className="space-y-3 pt-5">
                  <div className="flex items-end justify-between">
                    <div className="text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider block">
                        Saved / Target
                      </span>
                      <p className="text-base font-bold text-white">
                        {formatCurrency(goal.savedAmount)}{' '}
                        <span className="text-xs text-white/40">
                          / {formatCurrency(goal.targetAmount)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider block">
                        Completion
                      </span>
                      <p className="text-base font-semibold" style={{ color: themeColor }}>
                        {Math.round(progress)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, progress)}%`,
                          backgroundColor: getProgressBarColor(goal.status),
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-white/40 uppercase tracking-wider">
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
                <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <button
                    onClick={() => toggleHistory(goal.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>Contribution History ({goal.transactions?.length || 0})</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 space-y-2 max-h-40 overflow-y-auto pr-1">
                      {!goal.transactions || goal.transactions.length === 0 ? (
                        <p className="text-[10px] text-white/40 font-medium py-1 text-left">
                          No contributions recorded yet. Link a transaction to get started.
                        </p>
                      ) : (
                        goal.transactions.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.01] border"
                            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                          >
                            <div className="min-w-0 text-left space-y-0.5">
                              <p className="font-semibold text-white/80 truncate">
                                {t.description || 'Contribution'}
                              </p>
                              <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider">
                                {new Date(t.date).toLocaleDateString()} • {t.account?.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {t.contributionType === 'DEPOSIT' ? (
                                <span className="inline-flex items-center text-emerald-400 font-semibold">
                                  +{formatCurrency(t.amount)}
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-rose-450 font-semibold">
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
                <div className="absolute right-4 top-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {goal.status === 'ARCHIVED' ? (
                    <button
                      onClick={() => handleUnarchiveClick(goal)}
                      title="Activate goal"
                      className="rounded-lg p-1.5 text-white/45 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchiveClick(goal)}
                      title="Archive goal"
                      className="rounded-lg p-1.5 text-white/45 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(goal)}
                    className="rounded-lg p-1.5 text-white/45 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(goal)}
                    className="rounded-lg p-1.5 text-white/45 hover:bg-rose-500/10 hover:text-rose-455 transition-all active:scale-95 cursor-pointer"
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

export default GoalsPage;
