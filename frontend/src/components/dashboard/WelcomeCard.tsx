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
        icon: <Sun className="h-5 w-5 animate-spin-slow" style={{ color: 'rgba(255,255,255,0.55)' }} />,
      };
    } else if (hour < 18) {
      return {
        text: 'Good Afternoon',
        icon: <CloudSun className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.55)' }} />,
      };
    } else {
      return {
        text: 'Good Evening',
        icon: <Moon className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.55)' }} />,
      };
    }
  };

  const greeting = getGreeting();

  return (
    <h2 className="text-2xl sm:text-3xl font-bold text-white text-left">
      {greeting.text}, {name}
    </h2>
  );
};
