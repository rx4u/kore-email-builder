import { useEffect, useState } from 'react';
import { Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { signInWithGoogle, signInWithEmail, signUp } from '../lib/auth';
import { KoreLogo } from './KoreLogo';
import type { Session } from '@supabase/supabase-js';

interface AuthGateProps {
  children: React.ReactNode;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccessMsg('Account created! Check your email to confirm.');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModeToggle = () => {
    setIsSignUp(v => !v);
    setError('');
    setSuccessMsg('');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'DM Sans, sans-serif' }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
        {/* Left — Branding panel */}
        <div
          style={{
            flex: '0 0 55%',
            background: '#09090b',
            backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
            position: 'relative',
          }}
          className="hidden md:flex"
        >
          {/* Center content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
            <p style={{ color: '#f4f4f5', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.3 }}>
              Beautiful emails.<br />Zero complexity.
            </p>
            <p style={{ color: '#52525b', fontSize: '14px', margin: 0 }}>
              Kore Email Builder
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', padding: '0 32px' }}>
            {['Drag & drop blocks', 'Live preview', 'Gmail-safe HTML'].map(f => (
              <span
                key={f}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #27272a',
                  color: '#a1a1aa',
                  fontSize: '12px',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Form panel */}
        <div
          style={{
            flex: 1,
            background: '#111113',
            borderLeft: '1px solid #1c1c1f',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 40px',
          }}
        >
          {/* Mobile logo */}
          <div className="flex md:hidden" style={{ marginBottom: '32px' }}>
            <KoreLogo width={96} variant="light" />
          </div>

          <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 600, color: '#f4f4f5', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                {isSignUp ? 'Create account' : 'Welcome back'}
              </h1>
              <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>
                {isSignUp ? 'Start building beautiful emails today.' : 'Sign in to continue to Kore Email Builder.'}
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={signInWithGoogle}
              className="group"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                height: '40px',
                width: '100%',
                border: '1px solid #27272a',
                background: '#18181b',
                borderRadius: '8px',
                color: '#f4f4f5',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#1f1f22';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 2px #18181b40';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#18181b';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#27272a' }} />
              <span style={{ color: '#52525b', fontSize: '12px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#27272a' }} />
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #27272a',
                  background: '#18181b',
                  borderRadius: '6px',
                  color: '#f4f4f5',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'border-color 150ms',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#18181b')}
                onBlur={e => (e.target.style.borderColor = '#27272a')}
              />
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{
                    height: '40px',
                    padding: '0 40px 0 12px',
                    border: '1px solid #27272a',
                    background: '#18181b',
                    borderRadius: '6px',
                    color: '#f4f4f5',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'border-color 150ms',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#18181b')}
                  onBlur={e => (e.target.style.borderColor = '#27272a')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#52525b',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#a1a1aa')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#52525b')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error / Success messages */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '13px' }}>
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
            {successMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '13px' }}>
                <CheckCircle2 size={14} />
                {successMsg}
              </div>
            )}

            {/* Primary CTA */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                height: '40px',
                width: '100%',
                background: submitting ? '#27272a' : '#18181b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 150ms',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = '#27272a'; }}
              onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = '#18181b'; }}
              onMouseDown={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              {submitting ? 'Please wait...' : (isSignUp ? 'Create account' : 'Sign in')}
            </button>

            {/* Toggle sign-in / sign-up */}
            <p style={{ color: '#71717a', fontSize: '13px', textAlign: 'center', margin: 0 }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <span
                onClick={handleModeToggle}
                style={{ color: '#e4e4e7', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}
                onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.textDecoration = 'underline')}
                onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.textDecoration = 'none')}
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
