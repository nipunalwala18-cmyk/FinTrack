import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between h-full transition-all duration-200"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.22)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)';
      }}
    >
      {/* Top row: label + muted icon */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {title}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>
          {icon}
        </span>
      </div>

      {/* Value + caption */}
      <div className="space-y-1 text-left">
        <h3
          className="text-xl font-medium tracking-tight"
          style={{ color: '#fff', fontWeight: 500 }}
        >
          {value}
        </h3>
        <p
          className="text-[11px] font-medium"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};
