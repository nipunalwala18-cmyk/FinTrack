import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, CheckCircle, Mail, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100">
      {/* Top Navbar */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-[#12131a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Shield className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              FINANCE<span className="text-purple-600">FLOW</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-24 w-24 rounded-full object-cover border-4 border-purple-500/25"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <UserIcon className="h-12 w-12" />
                </div>
              )}
              {user.emailVerified && (
                <span className="absolute bottom-0 right-0 rounded-full bg-white p-1 dark:bg-gray-950">
                  <CheckCircle className="h-6 w-6 text-green-500 fill-white dark:fill-gray-950" />
                </span>
              )}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                {user.role}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {user.fullName}
              </h1>
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid gap-6 pt-8 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/40 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Authentication Provider
              </span>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {user.provider === 'GOOGLE' ? 'Google OAuth' : 'Local Email & Password'}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/40 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Account Created
              </span>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  dateStyle: 'long',
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-purple-500/5 p-6 border border-purple-500/10 flex items-start gap-4">
            <Database className="h-6 w-6 text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">
                OAuth & Refresh Token Session
              </h4>
              <p className="text-xs text-purple-700/80 dark:text-purple-400/80 leading-relaxed">
                Your login session is secured via an in-memory Access Token and an HttpOnly cookie-based Refresh Token. Closing the browser tab or reloading the page automatically restores the session.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
