import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { NavItem } from './NavItem';
import { Shield, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
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
      className={`hidden lg:flex flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#12131a] transition-all duration-300 shrink-0 select-none h-screen sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      {/* 1. Header & Brand Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800/80">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Shield className="h-7 w-7 text-purple-600 dark:text-purple-400 shrink-0" />
          {!isCollapsed && (
            <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white truncate">
              FINANCE<span className="text-purple-600">FLOW</span>
            </span>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden sm:flex h-6 w-6 items-center justify-center rounded-lg border border-gray-150 bg-gray-50 text-gray-400 hover:text-gray-950 transition-all dark:border-gray-800 dark:bg-gray-900/60 dark:hover:text-white"
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-grow py-5 px-3 space-y-1 overflow-y-auto">
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

      {/* 3. Footer User Profile Card */}
      {user && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-3 overflow-hidden shrink-0">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="h-9 w-9 rounded-full object-cover shrink-0 border border-purple-500/10"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shrink-0 font-bold uppercase border border-purple-100 dark:border-purple-900/40 text-sm">
                {user.fullName.charAt(0)}
              </div>
            )}
            {!isCollapsed && (
              <div className="text-left overflow-hidden min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user.fullName}
                </p>
                <p className="text-[10px] font-medium text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors shrink-0"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
