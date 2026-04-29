import { createClient } from '@supabase/supabase-js';

// Helper to get env vars with a helpful error if missing
const getEnv = (key, fallback) => {
  const val = import.meta.env[key];
  if (!val || val === fallback || val.includes('placeholder')) {
    console.error(`❌ MISSING ENV VAR: ${key}. Make sure it starts with VITE_ in Vercel!`);
  }
  return val || fallback;
};

const rawUrl = getEnv('VITE_SUPABASE_URL', 'https://your-project-id.supabase.co');

// Clean the URL properly
const supabaseUrl = rawUrl.trim().replace(/\/$/, '').replace('/rest/v1', '');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', '');

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.warn("⚠️ Supabase URL is not configured correctly. Check Vercel Env Vars.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
