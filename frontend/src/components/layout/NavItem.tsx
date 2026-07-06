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
        [
          // Base layout — single interactive element
          'relative flex items-center justify-start h-11 px-3.5 text-sm font-semibold rounded-xl',
          'transition-all duration-200 ease-out group cursor-pointer focus:outline-none',
          isActive
            // ── Active: solid white pill, black text/icon, soft shadow
            ? 'bg-white text-black shadow-md'
            // ── Inactive: muted with subtle hover transition
            : 'text-white/55 hover:bg-white/[0.08] hover:text-white focus-visible:bg-white/[0.08] focus-visible:text-white',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Centered or left aligned icon */}
          <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-full' : ''}`}>
            <Icon className="h-5 w-5" />
          </div>

          {/* Label — only in expanded mode */}
          {!isCollapsed && <span className="truncate ml-3">{title}</span>}

          {/* Collapsed-mode tooltip */}
          {isCollapsed && !isActive && (
            <span
              className="absolute left-[calc(100%+8px)] pointer-events-none z-50 whitespace-nowrap px-2.5 py-1.5 text-[11.5px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-100 delay-200"
              style={{
                background: '#141414',
                border: '0.5px solid rgba(255,255,255,0.12)',
              }}
            >
              {title}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};
export default NavItem;
