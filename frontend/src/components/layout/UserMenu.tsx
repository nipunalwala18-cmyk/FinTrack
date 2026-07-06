import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

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
        className="flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-full cursor-pointer"
        aria-label="User menu"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.fullName}
            className="h-9 w-9 rounded-full object-cover"
            style={{ border: '1px solid rgba(255,255,255,0.2)' }}
          />
        ) : (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full font-bold uppercase text-sm"
            style={{
              background: '#fff',
              color: '#000',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {user.fullName.charAt(0)}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2.5 w-72 origin-top-right rounded-2xl p-2.5 shadow-2xl animate-zoom-in text-left z-50"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.15)',
          }}
        >
          {/* Header section */}
          <div
            className="flex items-center gap-3 p-3 pb-3 mb-2"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="h-10 w-10 rounded-full object-cover shrink-0"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-bold uppercase text-base shrink-0"
                style={{
                  background: '#fff',
                  color: '#000',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {user.fullName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold truncate text-white leading-tight">
                {user.fullName}
              </p>
              <p className="text-[11px] font-semibold text-white/40 truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          {/* Links menu items */}
          <div className="space-y-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserMenu;
