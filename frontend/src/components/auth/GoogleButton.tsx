import React from 'react';

export const GoogleButton: React.FC = () => {
  const handleGoogleLogin = () => {
    // Redirect browser to backend Google OAuth initiation route
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.256-3.133C18.318 1.926 15.548 1 12.24 1c-6.076 0-11 4.924-11 11s4.924 11 11 11c6.34 0 10.556-4.437 10.556-10.714 0-.722-.075-1.275-.165-1.714H12.24z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
};
