import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// ── Demo credentials (work without Supabase) ─────────────────────────────────
const DEMO_ADMIN  = { id: 'demo-admin',  email: 'admin@swiggy.com',  password: 'admin123',  name: 'Admin User',  role: 'admin' };
const DEMO_USER   = { id: 'demo-user',   email: 'user@swiggy.com',   password: 'user123',   name: 'Demo User',   role: 'user'  };
const DEMO_ACCOUNTS = [DEMO_ADMIN, DEMO_USER];

const makeDemoSession = (acc) => ({
  id: acc.id, email: acc.email, name: acc.name, role: acc.role,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── helpers ──────────────────────────────────────────────────────────────
  const applyDemoSession = (acc) => {
    const p = makeDemoSession(acc);
    setUser(p);
    setProfile(p);
    localStorage.setItem('demo-session', JSON.stringify(p));
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) return null;
      setProfile(data);
      return data;
    } catch { return null; }
  };

  // ── init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // 1. Check demo session first (instant)
      const saved = localStorage.getItem('demo-session');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (mounted) { setUser(p); setProfile(p); setLoading(false); }
          return;
        } catch {}
      }

      // 2. Try real Supabase session with 5-second timeout
      try {
        const timeout  = new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 5000));
        const { data: { session } } = await Promise.race([supabase.auth.getSession(), timeout]);
        if (session && mounted) {
          setUser(session.user);
          localStorage.setItem('sb-token', session.access_token);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.warn('Auth init:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session) {
        setUser(session.user);
        localStorage.setItem('sb-token', session.access_token);
        await fetchProfile(session.user.id);
      } else if (!localStorage.getItem('demo-session')) {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('sb-token');
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // ── auth methods ──────────────────────────────────────────────────────────
  const signIn = async ({ email, password }) => {
    // Check demo accounts first
    const demo = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (demo) { applyDemoSession(demo); return { user: demo }; }

    // Real Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async ({ email, password, name, phone }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').upsert([{
        id: data.user.id, name, email, phone, role: 'user',
      }], { onConflict: 'id' });
    }
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    localStorage.removeItem('demo-session');
    localStorage.removeItem('sb-token');
    try { await supabase.auth.signOut(); } catch {}
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    // Demo mode
    if (user?.id?.startsWith('demo-')) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      localStorage.setItem('demo-session', JSON.stringify(updated));
      return updated;
    }
    const { data, error } = await supabase
      .from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, profile, loading, isAdmin,
      signUp, signIn, signInWithGoogle, signOut, updateProfile, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
