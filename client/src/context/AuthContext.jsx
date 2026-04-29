import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) setProfile(data);
      return data;
    } catch { return null; }
  };

  // ── Init — check localStorage for real session ───────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Check saved Supabase token (just localStorage check)
      const sbToken = localStorage.getItem('sb-token');
      if (!sbToken) {
        if (mounted) setLoading(false);
        return;
      }

      // Try Supabase (3s timeout)
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
        // Fallback: use stale session if network is just temporarily down
        // but for a clean app we'll let it be.
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
      } else {
        setUser(null); setProfile(null);
        localStorage.removeItem('sb-token');
        localStorage.removeItem('demo-session');
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // ── Auth methods ──────────────────────────────────────────────────────────
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email to log in.');
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password.');
        }
        throw error;
      }
      return data;
    } catch (err) {
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        throw new Error('Connection error. Please check your internet.');
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

      if (data.session) {
        return data;
      } else {
        throw new Error('Signup successful! Please check your email to verify your account.');
      }
    } catch (err) {
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        throw new Error('Connection error. Please try again later.');
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
    localStorage.removeItem('sb-token');
    localStorage.removeItem('demo-session');
    try { await supabase.auth.signOut(); } catch {}
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
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
