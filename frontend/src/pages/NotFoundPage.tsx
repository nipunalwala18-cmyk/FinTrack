import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-[#0b0c10] text-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[120px]" />

      <div className="relative z-10 space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mx-auto max-w-md text-base text-gray-500 dark:text-gray-400">
          The page you are looking for does not exist or has been moved to another path.
        </p>
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-purple-500/35 focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Safety</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
