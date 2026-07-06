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
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  return (
    <header
      className="sticky top-0 z-40 flex h-16 w-full items-center justify-between px-6 shrink-0 backdrop-blur-md"
      style={{
        background: 'rgba(10,10,10,0.85)',
        borderBottom: '0.5px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Left: Mobile hamburger menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-xl p-2 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <Breadcrumb />
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input Bar */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 w-64 transition-all duration-200 relative"
          style={{
            background: isFocused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
            border: '0.5px solid',
            borderColor: isFocused ? '#fff' : 'rgba(255,255,255,0.12)',
            borderRadius: 12,
            boxShadow: isFocused ? '0 0 0 2px rgba(255,255,255,0.05)' : 'none',
          }}
          onMouseEnter={e => {
            if (!isFocused) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }
          }}
          onMouseLeave={e => {
            if (!isFocused) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            }
          }}
        >
          <Search
            className="h-4.5 w-4.5 shrink-0 transition-colors duration-200"
            style={{ color: isFocused ? '#fff' : 'rgba(255,255,255,0.3)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search transactions, goals, accounts..."
            className="bg-transparent border-none outline-none text-xs w-full focus:ring-0 focus:outline-none placeholder:transition-opacity duration-200 font-semibold"
            style={{
              color: '#fff',
              opacity: searchQuery ? 1 : 0.8,
            }}
            aria-label="Search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="shrink-0 transition-colors cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            >
              <X className="h-4 w-4" />
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
