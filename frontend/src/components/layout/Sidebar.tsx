import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { NavItem } from './NavItem';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <aside
      className={`hidden lg:flex flex-col border-r transition-all duration-200 shrink-0 select-none h-screen sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-[260px]'
      }`}
      style={{
        background: '#0a0a0a',
        borderColor: 'rgba(255,255,255,0.12)',
        borderRightWidth: '0.5px',
      }}
    >
      {/* 1. Cohesive Header Container */}
      <div
        className="flex h-16 items-center justify-between px-5 py-4 shrink-0 transition-all duration-200"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Original line-chart SVG icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <polyline points="3,18 9,12 13,16 21,8" />
          </svg>
          {!isCollapsed && (
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '0.15em',
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              FINTRACK
            </span>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-all cursor-pointer"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg transition-all cursor-pointer"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            title="Expand Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. Navigation Items with clean spacing */}
      <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto scrollbar-hidden">
        {NAVIGATION_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            title={item.title}
            href={item.href}
            icon={item.icon}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* 3. Footer Profile Card */}
      {user && (
        <div
          className="p-4 flex flex-col gap-3 shrink-0"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}
        >
          <div
            className="flex items-center justify-between p-2 rounded-xl transition-all"
            style={{
              background: 'transparent',
            }}
          >
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.18)' }}
                />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 font-bold uppercase text-xs"
                  style={{
                    background: '#fff',
                    color: '#000',
                  }}
                >
                  {user.fullName.charAt(0)}
                </div>
              )}
              {!isCollapsed && (
                <div className="text-left overflow-hidden min-w-0">
                  <p className="text-xs font-semibold truncate text-white">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] truncate text-white/40">
                    {user.email}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="rounded-lg p-1.5 transition-colors shrink-0 cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
