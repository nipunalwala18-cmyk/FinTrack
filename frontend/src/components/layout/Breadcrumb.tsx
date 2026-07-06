import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
      <Link
        to="/dashboard"
        className="transition-colors"
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
      >
        Dashboard
      </Link>

      {paths.map((path, idx) => {
        // Skip rendering "dashboard" twice if it's the root path
        if (path.toLowerCase() === 'dashboard') return null;

        const href = `/${paths.slice(0, idx + 1).join('/')}`;
        const isLast = idx === paths.length - 1;
        const displayName = path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
            {isLast ? (
              <span className="capitalize" style={{ color: '#fff' }}>{displayName}</span>
            ) : (
              <Link
                to={href}
                className="transition-colors capitalize"
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
export default Breadcrumb;
