import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
      <Link
        to="/dashboard"
        className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
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
            <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700" />
            {isLast ? (
              <span className="text-gray-800 dark:text-white capitalize">{displayName}</span>
            ) : (
              <Link
                to={href}
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors capitalize"
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
