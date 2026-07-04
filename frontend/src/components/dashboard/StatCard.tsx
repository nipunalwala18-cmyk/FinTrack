import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  valueColor = 'text-gray-900 dark:text-white',
}) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1 text-left">
        <h3 className={`text-2xl font-black tracking-tight ${valueColor}`}>{value}</h3>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>
    </div>
  );
};
