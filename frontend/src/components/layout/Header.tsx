import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { NotificationBell } from '../notifications/NotificationBell';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Redesigned Search Input Bar */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/50 px-4 py-1.5 dark:border-gray-850 dark:bg-[#12131a]/40 w-60 text-gray-400 hover:border-gray-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300 relative">
          <Search className="h-4 w-4 shrink-0 text-gray-400 focus-within:text-purple-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, goals..."
            className="bg-transparent border-none outline-none text-xs w-full text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Notification Bell Dropdown */}
        <NotificationBell />

        {/* User Profile dropdown menu */}
        <UserMenu />
      </div>
    </header>
  );
};
export default Header;
