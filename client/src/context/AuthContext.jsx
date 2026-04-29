import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) setProfile(data);
      return data;
    } catch { return null; }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const sbToken = localStorage.getItem('sb-token');
      if (!sbToken) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        // Removed the strict 3s timeout to allow Supabase to wake up
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (mounted) {
          localStorage.removeItem('sb-token');
        }
      } catch (err) {
        console.error('Auth init error:', err);
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
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      // Show the ACTUAL error message to the user for debugging
      console.error('Login error:', err);
      throw new Error(err.message || 'Login failed. Please check your internet.');
    }
  };

  const signUp = async ({ email, password, name, phone }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data.user) {
        // Insert into profiles
        const { error: pError } = await supabase.from('profiles').upsert([{
          id: data.user.id, name, email, phone, role: 'user',
        }], { onConflict: 'id' });
        
        if (pError) console.warn('Profile sync error:', pError.message);
      }

      if (data.session) return data;
      else throw new Error('Signup successful! Please verify your email if required.');
    } catch (err) {
      console.error('Signup error:', err);
      throw new Error(err.message || 'Signup failed. Please try again.');
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
