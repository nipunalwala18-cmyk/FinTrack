import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../features/auth/schemas/auth.schema';
import { registerSchema } from '../../features/auth/schemas/auth.schema';
import type { LoginInput, RegisterInput } from '../../features/auth/schemas/auth.schema';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

/* ── Logo ─────────────────────────────────────────────────── */
const Logo = () => (
  <div className="flex items-center gap-2 text-white">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,18 9,12 13,16 21,8" />
    </svg>
    <span
      style={{
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: '0.15em',
        color: '#fff',
      }}
    >
      FINTRACK
    </span>
  </div>
);

/* ── Google "G" with official 4-color paths ───────────────── */
const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M533.5 278.4c0-17.7-1.6-35-4.6-51.7H272v97.9h147.2c-6.4 34.5-25.5 63.7-54.5 83.3v68.9h88.2c51.6-47.5 81.6-117.5 81.6-198.4z"
      fill="#4285F4"
    />
    <path
      d="M272 544.3c73.5 0 135.2-24.5 180.3-66.5l-88.2-68.9c-24.5 16.5-55.8 26-92.1 26-70.9 0-131-47.9-152.5-112.3H30.2v70.5C75.3 483.1 168.7 544.3 272 544.3z"
      fill="#34A853"
    />
    <path
      d="M119.5 322.6c-10.4-31-10.4-64.5 0-95.5v-70.5H30.2c-41.8 82.6-41.8 181.4 0 264l89.3-98z"
      fill="#FBBC05"
    />
    <path
      d="M272 107.3c39.8-.6 78.1 15.1 106.7 43.4l79.9-79.9C409.6 19.8 341.5-4.2 272 0 168.7 0 75.3 61.2 30.2 151l89.3 70.5c21.5-64.4 81.6-114.2 152.5-114.2z"
      fill="#EA4335"
    />
  </svg>
);

/* ── Types ────────────────────────────────────────────────── */
type Tab = 'login' | 'register';

interface Props {
  initialTab?: Tab;
}

/* ── Shared sub-components ────────────────────────────────── */
const Divider = () => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
    <span
      style={{
        fontSize: 11,
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
      }}
    >
      or
    </span>
    <div className="flex-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
  </div>
);

interface InputProps {
  id: string;
  label: string;
  type?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  showPwd?: boolean;
  error?: string;
  [key: string]: any;
}

const Field = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, type = 'text', showToggle, onToggle, showPwd, error, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={showToggle ? (showPwd ? 'text' : 'password') : type}
          style={{
            width: '100%',
            background: '#141414',
            border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            color: '#fff',
            outline: 'none',
            paddingRight: showToggle ? 38 : 12,
          }}
          onFocus={e =>
            (e.currentTarget.style.borderColor = error
              ? 'rgba(248,113,113,0.6)'
              : 'rgba(255,255,255,0.35)')
          }
          onBlur={e =>
            (e.currentTarget.style.borderColor = error
              ? 'rgba(248,113,113,0.5)'
              : 'rgba(255,255,255,0.15)')
          }
          {...rest}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
              padding: 0,
              display: 'flex',
            }}
          >
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontSize: 11, color: 'rgba(248,113,113,0.9)', marginTop: 2 }}>
          {error}
        </span>
      )}
    </div>
  )
);
Field.displayName = 'Field';

/* ── Main AuthScreen ──────────────────────────────────────── */
export const AuthScreen: React.FC<Props> = ({ initialTab = 'login' }) => {
  const navigate = useNavigate();
  const { login, requestOtp, verifyOtp } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [fading, setFading] = useState(false);
  const [showPwdLogin, setShowPwdLogin] = useState(false);
  const [showPwdReg, setShowPwdReg] = useState(false);

  /* ---------- tab switch with crossfade ---------- */
  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setFading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setOtpSent(false);
      setOtpCode('');
      setRegFormError(null);
      setLoginFormError(null);
      setFading(false);
    }, 160);
  };

  /* ---------- Login form ---------- */
  const [loginFormError, setLoginFormError] = useState<string | null>(null);
  const {
    register: lr,
    handleSubmit: handleLoginSubmit,
    formState: { errors: le, isSubmitting: ls },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onLogin = handleLoginSubmit(async (data) => {
    setLoginFormError(null);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setLoginFormError(err.message || 'Invalid email or password');
    }
  });

  /* ---------- Register form (step 1) ---------- */
  const [regFormError, setRegFormError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const {
    register: rr,
    handleSubmit: handleRegSubmit,
    formState: { errors: re, isSubmitting: rs },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onRegister = handleRegSubmit(async (data) => {
    setRegFormError(null);
    try {
      await requestOtp(data);
      setEmailForOtp(data.email);
      setOtpSent(true);
    } catch (err: any) {
      setRegFormError(err.message || 'Failed to send verification code');
    }
  });

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegFormError(null);
    if (otpCode.length !== 6) {
      setRegFormError('Enter a 6-digit code');
      return;
    }
    setVerifying(true);
    try {
      await verifyOtp(emailForOtp, otpCode);
      navigate('/dashboard');
    } catch (err: any) {
      setRegFormError(err.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  /* ---------- Google ---------- */
  const handleGoogle = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  /* ---------- Shared styles ---------- */
  const tabBtn = (active: boolean) => ({
    flex: 1,
    borderRadius: 8,
    padding: '7px 0',
    fontSize: 13,
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    background: active ? '#fff' : 'transparent',
    color: active ? '#000' : 'rgba(255,255,255,0.6)',
  } as React.CSSProperties);

  const primaryBtn = (disabled?: boolean) => ({
    width: '100%',
    borderRadius: 8,
    padding: '9px 0',
    fontSize: 13,
    fontWeight: 500,
    background: '#fff',
    color: '#000',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  } as React.CSSProperties);

  const googleBtn = {
    width: '100%',
    borderRadius: 8,
    padding: '9px 0',
    fontSize: 13,
    fontWeight: 500,
    background: 'transparent',
    color: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(255,255,255,0.18)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background 0.15s',
  } as React.CSSProperties;

  /* ---------- Render ---------- */
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* Floating particles */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className={`auth-particle auth-particle-${i + 1}`} />
      ))}

      {/* ── Card ─────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: 380,
          height: 560,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.13)',
          background: '#0a0a0a',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Heading */}
        <h1
          style={{
            margin: '16px 0 4px',
            fontSize: 19,
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.3,
          }}
        >
          {activeTab === 'login' ? 'Sign in to FinTrack' : 'Create your account'}
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px' }}>
          {activeTab === 'login'
            ? 'Track your finances with clarity.'
            : 'Start managing your money with FinTrack.'}
        </p>

        {/* Tab control */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 10,
            padding: 3,
            marginBottom: 20,
          }}
        >
          <button style={tabBtn(activeTab === 'login')} onClick={() => switchTab('login')}>
            Sign in
          </button>
          <button style={tabBtn(activeTab === 'register')} onClick={() => switchTab('register')}>
            Create account
          </button>
        </div>

        {/* Pane wrapper — occupies remaining space, panes absolutely stacked */}
        <div style={{ position: 'relative', flex: 1 }}>
          {/* ── Login pane ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              opacity: activeTab === 'login' && !fading ? 1 : 0,
              transition: 'opacity 0.16s ease',
              pointerEvents: activeTab === 'login' ? 'auto' : 'none',
            }}
          >
            <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column', height: '100%' }} noValidate>
              {/* Fields area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {loginFormError && (
                  <div
                    aria-live="polite"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'rgba(248,113,113,0.1)',
                      border: '1px solid rgba(248,113,113,0.25)',
                      fontSize: 12,
                      color: 'rgba(248,113,113,0.9)',
                    }}
                  >
                    {loginFormError}
                  </div>
                )}
                <Field
                  id="login-email"
                  label="Email"
                  type="email"
                  {...lr('email')}
                  error={le.email?.message}
                />
                <Field
                  id="login-password"
                  label="Password"
                  showToggle
                  showPwd={showPwdLogin}
                  onToggle={() => setShowPwdLogin(p => !p)}
                  {...lr('password')}
                  error={le.password?.message}
                />
              </div>

              {/* Bottom actions — always anchored at bottom */}
              <div style={{ marginTop: 24 }}>
                <button type="submit" disabled={ls} style={primaryBtn(ls)}>
                  {ls && <Loader2 size={14} className="animate-spin" />}
                  {ls ? 'Signing in…' : 'Sign in'}
                </button>
                <Divider />
                <button type="button" style={googleBtn} onClick={handleGoogle}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <GoogleG />
                  Continue with Google
                </button>
              </div>
            </form>
          </div>

          {/* ── Register pane ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              opacity: activeTab === 'register' && !fading ? 1 : 0,
              transition: 'opacity 0.16s ease',
              pointerEvents: activeTab === 'register' ? 'auto' : 'none',
            }}
          >
            {otpSent ? (
              /* OTP verification sub-step */
              <form onSubmit={onVerify} style={{ display: 'flex', flexDirection: 'column', height: '100%' }} noValidate>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                    We sent a 6-digit code to <span style={{ color: '#fff' }}>{emailForOtp}</span>
                  </p>
                  {regFormError && (
                    <div
                      aria-live="polite"
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(248,113,113,0.1)',
                        border: '1px solid rgba(248,113,113,0.25)',
                        fontSize: 12,
                        color: 'rgba(248,113,113,0.9)',
                      }}
                    >
                      {regFormError}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="otp-code"
                      style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}
                    >
                      Verification code
                    </label>
                    <input
                      id="otp-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{
                        background: '#141414',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 22,
                        color: '#fff',
                        outline: 'none',
                        letterSpacing: '0.35em',
                        textAlign: 'center',
                        width: '100%',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                    }}
                  >
                    ← Go back
                  </button>
                </div>
                <div style={{ marginTop: 24 }}>
                  <button
                    type="submit"
                    disabled={verifying || otpCode.length !== 6}
                    style={primaryBtn(verifying || otpCode.length !== 6)}
                  >
                    {verifying && <Loader2 size={14} className="animate-spin" />}
                    {verifying ? 'Verifying…' : 'Verify & Sign Up'}
                  </button>
                  <Divider />
                  <button type="button" style={googleBtn} onClick={handleGoogle}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <GoogleG />
                    Continue with Google
                  </button>
                </div>
              </form>
            ) : (
              /* Registration step 1 */
              <form onSubmit={onRegister} style={{ display: 'flex', flexDirection: 'column', height: '100%' }} noValidate>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {regFormError && (
                    <div
                      aria-live="polite"
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(248,113,113,0.1)',
                        border: '1px solid rgba(248,113,113,0.25)',
                        fontSize: 12,
                        color: 'rgba(248,113,113,0.9)',
                      }}
                    >
                      {regFormError}
                    </div>
                  )}
                  <Field
                    id="reg-name"
                    label="Full name"
                    type="text"
                    {...rr('fullName')}
                    error={re.fullName?.message}
                  />
                  <Field
                    id="reg-email"
                    label="Email"
                    type="email"
                    {...rr('email')}
                    error={re.email?.message}
                  />
                  <Field
                    id="reg-password"
                    label="Password"
                    showToggle
                    showPwd={showPwdReg}
                    onToggle={() => setShowPwdReg(p => !p)}
                    {...rr('password')}
                    error={re.password?.message}
                  />
                </div>
                <div style={{ marginTop: 24 }}>
                  <button type="submit" disabled={rs} style={primaryBtn(rs)}>
                    {rs && <Loader2 size={14} className="animate-spin" />}
                    {rs ? 'Sending code…' : 'Continue'}
                  </button>
                  <Divider />
                  <button type="button" style={googleBtn} onClick={handleGoogle}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <GoogleG />
                    Continue with Google
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
