import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  const shimmer = {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
  };

  const card = {
    background: '#0a0a0a',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  };

  return (
    <div className="w-full space-y-5 animate-pulse">
      {/* Welcome row skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div style={{ ...shimmer, height: 10, width: 60 }} />
          <div style={{ ...shimmer, height: 28, width: 220 }} />
        </div>
        <div style={{ ...shimmer, height: 40, width: 40, borderRadius: 12 }} />
      </div>

      {/* 4 Summary card skeletons */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} style={card} className="flex flex-col justify-between" css-height="120px">
            <div className="flex items-center justify-between mb-4">
              <div style={{ ...shimmer, height: 10, width: 80 }} />
              <div style={{ ...shimmer, height: 16, width: 16, borderRadius: '50%' }} />
            </div>
            <div className="space-y-2">
              <div style={{ ...shimmer, height: 22, width: 100 }} />
              <div style={{ ...shimmer, height: 9, width: 130 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid skeleton: MonthStats (2fr) + Sidebar col (1fr) */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 items-start">
        {/* MonthStatistics card skeleton */}
        <div style={{ ...card, padding: 24 }} className="lg:col-span-2 space-y-5">
          <div
            className="flex items-center justify-between pb-5"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ ...shimmer, height: 14, width: 200 }} />
            <div style={{ ...shimmer, height: 24, width: 110, borderRadius: 999 }} />
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: '#141414' }}
              >
                <div style={{ ...shimmer, height: 20, width: 20, borderRadius: '50%' }} />
                <div className="space-y-2">
                  <div style={{ ...shimmer, height: 9, width: 50 }} />
                  <div style={{ ...shimmer, height: 18, width: 80 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="space-y-4">
          {/* AccountsList skeleton */}
          <div style={{ ...card, padding: 20 }} className="space-y-3">
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ ...shimmer, height: 14, width: 80 }} />
              <div style={{ ...shimmer, height: 12, width: 30 }} />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#141414' }}>
                <div className="flex items-center gap-3">
                  <div style={{ ...shimmer, height: 32, width: 32, borderRadius: 8 }} />
                  <div className="space-y-1.5">
                    <div style={{ ...shimmer, height: 12, width: 90 }} />
                    <div style={{ ...shimmer, height: 9, width: 60 }} />
                  </div>
                </div>
                <div style={{ ...shimmer, height: 12, width: 60 }} />
              </div>
            ))}
          </div>

          {/* GoalsOverview skeleton */}
          <div style={{ ...card, padding: 20 }} className="space-y-3">
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ ...shimmer, height: 14, width: 100 }} />
              <div style={{ ...shimmer, height: 12, width: 50 }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 space-y-3" style={{ background: '#141414' }}>
                <div style={{ ...shimmer, height: 60, width: 60, borderRadius: '50%', margin: '0 auto' }} />
                <div style={{ ...shimmer, height: 9, width: 70, margin: '0 auto' }} />
              </div>
              <div className="space-y-3 flex flex-col justify-center">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ ...shimmer, height: 28, width: 28, borderRadius: 8 }} />
                    <div className="space-y-1">
                      <div style={{ ...shimmer, height: 9, width: 50 }} />
                      <div style={{ ...shimmer, height: 12, width: 20 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
