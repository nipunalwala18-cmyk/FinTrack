import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-[#0b0c10] sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <Shield className="h-10 w-10 animate-pulse" />
          <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            FINANCE<span className="text-purple-600">FLOW</span>
          </span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
