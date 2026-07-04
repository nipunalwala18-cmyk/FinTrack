import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-[#12131a]/80 backdrop-blur-md px-6 shrink-0">
      {/* Left: Mobile hamburger menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white focus:outline-none"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <Breadcrumb />
      </div>

      {/* Right: Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input Bar (Placeholder) */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-905/30 w-48 text-gray-400 hover:border-gray-300 transition-all cursor-text select-none">
          <Search className="h-4 w-4 shrink-0" />
          <span className="text-xs">Search...</span>
        </div>

        {/* Notifications Alert (Placeholder) */}
        <button
          className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Dark/Light Theme Toggle */}
        <ThemeToggle />

        {/* User Profile dropdown menu */}
        <UserMenu />
      </div>
    </header>
  );
};
export default Header;
