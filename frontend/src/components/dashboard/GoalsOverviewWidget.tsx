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
      <div
        className="rounded-2xl p-5 animate-pulse"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.12)',
          minHeight: 200,
        }}
      />
    );
  }

  if (isError) {
    return null;
  }

  // Calculations
  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE').length;
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;

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

  const topGoals = goals
    .filter((g) => g.status === 'ACTIVE')
    .map((g) => {
      const p = g.targetAmount > 0 ? (g.savedAmount / g.targetAmount) * 100 : 0;
      return { goal: g, progress: Math.min(100, Math.max(0, p)) };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  const overdueAlerts = goals.filter(
    (g) => g.status === 'FAILED' || (g.status === 'ACTIVE' && new Date() > new Date(g.targetDate))
  );

  return (
    <div
      className="rounded-2xl p-5 flex flex-col space-y-5 h-full"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Header — matched to AccountsList */}
      <div
        className="flex items-center justify-between pb-3"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: '#fff' }}>
          Goals Overview
        </h3>
        <button
          onClick={() => navigate('/goals')}
          className="flex items-center gap-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {totalGoals === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <Target className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm" style={{ color: '#fff' }}>
              No goals set yet
            </h4>
            <p className="text-xs max-w-[200px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Set financial targets to save money and limit expenses.
            </p>
          </div>
          <button
            onClick={() => navigate('/goals')}
            className="rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95"
            style={{
              background: '#fff',
              color: '#000',
            }}
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Overall Progress + Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* Circular progress ring */}
            <div
              className="flex flex-col items-center justify-center p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <div className="relative flex items-center justify-center h-16 w-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Track */}
                  <path
                    strokeWidth="3.5"
                    stroke="#1c1c1c"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Fill — white */}
                  <path
                    strokeWidth="3.5"
                    strokeDasharray={`${overallProgress}, 100`}
                    strokeLinecap="round"
                    stroke="#fff"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-semibold" style={{ color: '#fff' }}>
                  {overallProgress}%
                </span>
              </div>
              <span
                className="text-[10px] font-bold uppercase mt-2 text-center tracking-wider"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Overall Progress
              </span>
            </div>

            {/* Quick stats */}
            <div className="flex flex-col gap-3 justify-center">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Play
                    className="h-3 w-3"
                    style={{ color: 'rgba(255,255,255,0.6)', fill: 'rgba(255,255,255,0.6)' }}
                  />
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase leading-none"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Active
                  </p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: '#fff' }}>
                    {activeGoals}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <CheckCircle className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.6)' }} />
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase leading-none"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Completed
                  </p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: '#fff' }}>
                    {completedGoals}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Active Goals */}
          {topGoals.length > 0 && (
            <div className="space-y-2.5">
              <h4
                className="text-[10px] font-bold uppercase tracking-wider text-left"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Closest to Completion
              </h4>
              <div className="space-y-2">
                {topGoals.map(({ goal, progress }) => (
                  <div
                    key={goal.id}
                    onClick={() => navigate('/goals')}
                    className="flex flex-col gap-1.5 p-2.5 rounded-xl cursor-pointer transition-all text-left"
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
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold line-clamp-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {goal.name}
                      </span>
                      <span className="font-bold" style={{ color: '#fff' }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    {/* White-on-dark-gray progress bar */}
                    <div
                      className="relative h-1.5 w-full rounded-full overflow-hidden"
                      style={{ background: '#1c1c1c' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: '#fff' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overdue / failed alerts */}
          {overdueAlerts.length > 0 && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl text-left"
              style={{
                background: 'rgba(248,113,113,0.06)',
                border: '0.5px solid rgba(248,113,113,0.2)',
              }}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: 'rgba(248,113,113,0.8)' }} />
              <p
                className="text-[11px] font-semibold leading-tight"
                style={{ color: 'rgba(248,113,113,0.9)' }}
              >
                {overdueAlerts.length} goal{overdueAlerts.length > 1 ? 's' : ''} failed or overdue. Check
                dates on the Goals page.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsOverviewWidget;
