import { createClient } from '@supabase/supabase-js';

// Helper to get env vars safely
const getEnv = (key, fallback) => {
  const val = import.meta.env[key];
  if (!val) {
    console.error(`❌ MISSING: ${key}. Add this to Vercel Settings!`);
    return fallback;
  }
  return val;
};

// Get the URL and ensure it's a string before calling .trim()
const rawUrl = getEnv('VITE_SUPABASE_URL', '');
const cleanedUrl = (rawUrl || '').trim().replace(/\/$/, '').replace('/rest/v1', '');

// Fallback to a valid-looking URL format to prevent createClient from crashing the whole app
const supabaseUrl = cleanedUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'placeholder');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
