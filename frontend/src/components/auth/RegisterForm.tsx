import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../features/auth/schemas/auth.schema';
import type { RegisterInput } from '../../features/auth/schemas/auth.schema';
import { useAuth } from '../../context/AuthContext';
import { GoogleButton } from './GoogleButton';
import { Eye, EyeOff, Loader2, KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const { requestOtp, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [emailSubmitted, setEmailSubmitted] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Form handling for Step 1 (Register request)
  const {
    register: registerForm,
    handleSubmit: handleStep1Submit,
    formState: { errors: step1Errors, isSubmitting: isStep1Submitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  // Verification handling for Step 2
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const onStep1Submit = async (data: RegisterInput) => {
    setFormError(null);
    setSuccessMessage(null);
    try {
      await requestOtp(data);
      setEmailSubmitted(data.email);
      setStep(2);
    } catch (err: any) {
      setFormError(err.message || 'Failed to request verification code');
    }
  };

  const onStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (otpCode.length !== 6) {
      setFormError('Verification code must be exactly 6 digits');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtp(emailSubmitted, otpCode);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'OTP verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setFormError(null);
    setSuccessMessage(null);
    setIsResending(true);
    try {
      await resendOtp(emailSubmitted);
      setSuccessMessage('A new verification code has been sent to your email');
    } catch (err: any) {
      setFormError(err.message || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  if (step === 2) {
    return (
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="text-center relative">
          <button
            onClick={() => setStep(1)}
            className="absolute left-0 top-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Verify Email
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <Mail className="h-4 w-4" />
            <span>We sent a 6-digit code to {emailSubmitted}</span>
          </p>
        </div>

        {formError && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-100 dark:bg-red-950/20 dark:border-red-900/40">
            <div className="text-sm font-medium text-red-700 dark:text-red-400">{formError}</div>
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl bg-green-50 p-4 border border-green-100 dark:bg-green-950/20 dark:border-green-900/40">
            <div className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</div>
          </div>
        )}

        <form onSubmit={onStep2Submit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center tracking-[12px] text-2xl font-bold rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || otpCode.length !== 6}
            className="flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:bg-purple-700 hover:shadow-purple-500/35 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              'Verify & Sign Up'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-sm font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50"
          >
            {isResending ? 'Resending...' : 'Resend verification code'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Get started with your personal finance manager.
        </p>
      </div>

      {formError && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100 dark:bg-red-950/20 dark:border-red-900/40">
          <div className="text-sm font-medium text-red-700 dark:text-red-400">{formError}</div>
        </div>
      )}

      <form onSubmit={handleStep1Submit(onStep1Submit)} className="mt-6 space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            {...registerForm('fullName')}
            className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-800 dark:text-white ${
              step1Errors.fullName
                ? 'border-red-300 dark:border-red-900 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            placeholder="Jane Doe"
          />
          {step1Errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{step1Errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            {...registerForm('email')}
            className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-800 dark:text-white ${
              step1Errors.email
                ? 'border-red-300 dark:border-red-900 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            placeholder="you@example.com"
          />
          {step1Errors.email && (
            <p className="mt-1 text-xs text-red-500">{step1Errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...registerForm('password')}
              className={`w-full rounded-xl border px-4 py-3 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-800 dark:text-white ${
                step1Errors.password
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
          {step1Errors.password && (
            <p className="mt-1 text-xs text-red-500">{step1Errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isStep1Submitting}
          className="flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:bg-purple-700 hover:shadow-purple-500/35 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isStep1Submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Sending code...</span>
            </>
          ) : (
            'Continue'
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
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
