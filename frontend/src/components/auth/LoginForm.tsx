import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../features/auth/schemas/auth.schema';
import type { LoginInput } from '../../features/auth/schemas/auth.schema';
import { useAuth } from '../../context/AuthContext';
import { GoogleButton } from './GoogleButton';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setFormError(null);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Simplify your personal finances today.
        </p>
      </div>

      <LoginFormError message={formError} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-800 dark:text-white ${
              errors.email
                ? 'border-red-300 dark:border-red-900 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`w-full rounded-xl border px-4 py-3 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-800 dark:text-white ${
                errors.password
                  ? 'border-red-300 dark:border-red-900 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:bg-purple-700 hover:shadow-purple-500/35 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Or</span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

const LoginFormError: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="rounded-xl bg-red-50 p-4 border border-red-100 dark:bg-red-950/20 dark:border-red-900/40">
      <div className="text-sm font-medium text-red-700 dark:text-red-400">{message}</div>
    </div>
  );
};
