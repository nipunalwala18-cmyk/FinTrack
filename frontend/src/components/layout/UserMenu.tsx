import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.fullName}
            className="h-9 w-9 rounded-full object-cover border-2 border-purple-500/20"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 font-bold uppercase">
            {user.fullName.charAt(0)}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-52 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-gray-100 dark:bg-[#12131a] dark:border-gray-800 animate-fade-in text-left z-50">
          <div className="px-3 py-2 border-b border-gray-50 dark:border-gray-800/60 pb-2.5 mb-1.5">
            <p className="text-xs font-semibold text-gray-400">Signed in as</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.fullName}</p>
          </div>

          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white transition-colors"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>

          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default UserMenu;
