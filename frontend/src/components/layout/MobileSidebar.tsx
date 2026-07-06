import React, { useEffect } from 'react';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { NavItem } from './NavItem';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ESC key closes drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      />

      {/* Drawer content */}
      <div
        className="relative flex w-[280px] max-w-xs flex-col h-full shadow-2xl p-4 text-left z-50 animate-slide-right-in"
        style={{
          background: '#0a0a0a',
          borderRight: '0.5px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Header brand logo */}
        <div
          className="flex h-14 items-center justify-between pb-3 mb-4"
          style={{ borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}
        >
          <div className="flex items-center gap-2.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3,18 9,12 13,16 21,8" />
            </svg>
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '0.15em',
                color: '#fff',
              }}
            >
              FINTRACK
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-all"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-grow space-y-1 overflow-y-auto pr-1">
          {NAVIGATION_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              title={item.title}
              href={item.href}
              icon={item.icon}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Footer profile & logout */}
        {user && (
          <div
            className="pt-4 flex items-center justify-between gap-3 overflow-hidden shrink-0 mt-4"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-9 w-9 rounded-full object-cover shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.18)' }}
                />
              ) : (
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full shrink-0 font-bold uppercase text-sm"
                  style={{ background: '#fff', color: '#000' }}
                >
                  {user.fullName.charAt(0)}
                </div>
              )}
              <div className="text-left overflow-hidden min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#fff' }}>
                  {user.fullName}
                </p>
                <p className="text-[10px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MobileSidebar;
