import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const OAuthCallbackPage: React.FC = () => {
  const { googleLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      googleLogin(token)
        .then(() => {
          navigate('/dashboard', { replace: true });
        })
        .catch((err) => {
          setError(err.message || 'OAuth authentication failed');
        });
    } else {
      setError('OAuth authentication failed: No token provided');
    }
  }, [searchParams, googleLogin, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-[#0b0c10] text-center">
        <div className="rounded-2xl bg-red-50 p-6 dark:bg-red-950/20 border border-red-100 dark:border-red-900 max-w-md space-y-4">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Authentication Error</h2>
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#0b0c10] text-gray-500">
      <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      <span className="mt-3 text-sm font-semibold tracking-wide">Completing sign in...</span>
    </div>
  );
};
