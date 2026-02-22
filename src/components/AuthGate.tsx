import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signInWithGoogle, signInWithEmail } from '../lib/auth';
import type { Session } from '@supabase/supabase-js';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  const handleEmailSignIn = async () => {
    setError('');
    try {
      await signInWithEmail(email, password);
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#09090b', color:'#f4f4f5', fontFamily:'DM Sans, sans-serif' }}>
      Loading...
    </div>
  );

  if (!session) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:'16px', background:'#09090b', color:'#f4f4f5', fontFamily:'DM Sans, sans-serif' }}>
      <h1 style={{ fontSize:'28px', fontWeight:700, margin:0 }}>Kore Email Builder</h1>
      <p style={{ color:'#71717a', margin:0 }}>Sign in to continue</p>
      <button
        onClick={signInWithGoogle}
        style={{ background:'#f4f4f5', color:'#09090b', border:'none', borderRadius:'8px', padding:'12px 24px', fontWeight:600, cursor:'pointer', width:'280px', fontSize:'14px' }}
      >
        Continue with Google
      </button>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'280px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding:'10px 14px', borderRadius:'8px', border:'1px solid #27272a', background:'#18181b', color:'#f4f4f5', outline:'none', fontSize:'14px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEmailSignIn()}
          style={{ padding:'10px 14px', borderRadius:'8px', border:'1px solid #27272a', background:'#18181b', color:'#f4f4f5', outline:'none', fontSize:'14px' }}
        />
        {error && <p style={{ color:'#ef4444', fontSize:'12px', margin:0 }}>{error}</p>}
        <button
          onClick={handleEmailSignIn}
          style={{ background:'#f59e0b', color:'#09090b', border:'none', borderRadius:'8px', padding:'10px', fontWeight:600, cursor:'pointer', fontSize:'14px' }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  return <>{children}</>;
}
