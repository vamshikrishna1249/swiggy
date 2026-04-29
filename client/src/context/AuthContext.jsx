import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// ── Demo credentials (work 100% offline, no Supabase needed) ─────────────────
const DEMO_ADMIN  = { id: 'demo-admin',  email: 'admin@swiggy.com',  password: 'admin123',  name: 'Admin User',  role: 'admin' };
const DEMO_USER   = { id: 'demo-user',   email: 'user@swiggy.com',   password: 'user123',   name: 'Demo User',   role: 'user'  };
const DEMO_ACCOUNTS = [DEMO_ADMIN, DEMO_USER];

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyDemoSession = (acc) => {
    const p = { id: acc.id, email: acc.email, name: acc.name, role: acc.role };
    setUser(p);
    setProfile(p);
    localStorage.setItem('demo-session', JSON.stringify(p));
  };

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) setProfile(data);
      return data;
    } catch { return null; }
  };

  // ── Init — check localStorage FIRST, instant, no network ─────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // 1. Check saved demo session instantly (no network)
      const saved = localStorage.getItem('demo-session');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (mounted) { setUser(p); setProfile(p); setLoading(false); }
          return; // done — no need to hit Supabase
        } catch { localStorage.removeItem('demo-session'); }
      }

      // 2. Check saved Supabase token (no network, just localStorage)
      const sbToken = localStorage.getItem('sb-token');
      if (!sbToken) {
        // No session of any kind — go to login
        if (mounted) setLoading(false);
        return;
      }

      // 3. Only if we have a real token, try Supabase (3s timeout)
      try {
        const timeout = new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 3000));
        const { data: { session } } = await Promise.race([supabase.auth.getSession(), timeout]);
        if (session && mounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (mounted) {
          localStorage.removeItem('sb-token');
        }
      } catch {
        // Supabase unreachable — clear stale token
        localStorage.removeItem('sb-token');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    // Listen for real Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted || localStorage.getItem('demo-session')) return;
      if (session) {
        setUser(session.user);
        localStorage.setItem('sb-token', session.access_token);
        await fetchProfile(session.user.id);
      } else {
        setUser(null); setProfile(null);
        localStorage.removeItem('sb-token');
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // ── Auth methods ──────────────────────────────────────────────────────────
  const signIn = async ({ email, password }) => {
    // Demo accounts — instant, no network required
    const demo = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (demo) { applyDemoSession(demo); return { user: demo }; }

    // Real Supabase login
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        throw new Error('Cannot connect to server. Use demo credentials instead: admin@swiggy.com / admin123');
      }
      throw err;
    }
  };

  const signUp = async ({ email, password, name, phone }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        await supabase.from('profiles').upsert([{
          id: data.user.id, name, email, phone, role: 'user',
        }], { onConflict: 'id' });
      }
      return data;
    } catch (err) {
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        throw new Error('Cannot connect. Try demo login: user@swiggy.com / user123');
      }
      throw err;
    }
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
