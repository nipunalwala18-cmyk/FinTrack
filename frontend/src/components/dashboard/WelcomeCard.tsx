import React from 'react';
import { Sun, CloudSun, Moon } from 'lucide-react';

interface WelcomeCardProps {
  name: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ name }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        text: 'Good Morning',
        icon: <Sun className="h-6 w-6 text-amber-500 animate-spin-slow" />,
      };
    } else if (hour < 18) {
      return {
        text: 'Good Afternoon',
        icon: <CloudSun className="h-6 w-6 text-orange-400" />,
      };
    } else {
      return {
        text: 'Good Evening',
        icon: <Moon className="h-6 w-6 text-indigo-400" />,
      };
    }
  };

  const greeting = getGreeting();

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
      <div className="space-y-1 text-left">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Dashboard</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {greeting.text},{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300">
            {name}
          </span>
        </h2>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        {greeting.icon}
      </div>
    </div>
  );
};
