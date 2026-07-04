import React, { useEffect } from 'react';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { NavItem } from './NavItem';
import { Shield, X, LogOut } from 'lucide-react';
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
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      />

      {/* Drawer content */}
      <div className="relative flex w-[280px] max-w-xs flex-col bg-white h-full shadow-2xl border-r border-gray-150 dark:border-gray-800 dark:bg-[#12131a] p-4 text-left z-50 animate-slide-right-in">
        {/* Header brand logo */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-7 w-7 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
              FINANCE<span className="text-purple-600">FLOW</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all dark:hover:bg-gray-900 dark:hover:text-white"
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
          <div className="border-t border-gray-100 dark:border-gray-800/80 pt-4 flex items-center justify-between gap-3 overflow-hidden shrink-0 mt-4">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-9 w-9 rounded-full object-cover shrink-0 border border-purple-500/15"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shrink-0 font-bold uppercase border border-purple-100 dark:border-purple-900/40 text-sm">
                  {user.fullName.charAt(0)}
                </div>
              )}
              <div className="text-left overflow-hidden min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user.fullName}
                </p>
                <p className="text-[10px] font-medium text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
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
