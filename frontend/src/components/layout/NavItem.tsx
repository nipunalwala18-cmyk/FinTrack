import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  title,
  href,
  icon: Icon,
  isCollapsed = false,
  onClick,
}) => {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group focus:outline-none ${
          isActive
            ? 'bg-purple-50/70 text-purple-600 dark:bg-purple-950/25 dark:text-purple-400'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900/40 dark:hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Left Indicator Bar */}
          {isActive && (
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-purple-600 dark:bg-purple-500 rounded-r-md" />
          )}

          <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'}`} />

          {!isCollapsed && <span className="truncate">{title}</span>}

          {/* Simple CSS Tooltip when collapsed */}
          {isCollapsed && (
            <span className="absolute left-16 scale-0 rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white group-hover:scale-100 transition-all dark:bg-gray-800 pointer-events-none z-50 shadow-md">
              {title}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};
export default NavItem;
