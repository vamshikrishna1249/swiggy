import { createClient } from '@supabase/supabase-js';

// --- PRODUCTION FAIL-SAFE ---
// These are your specific project details. We use these as the default 
// so the app works even if Vercel settings are missing.
const DEFAULT_URL = 'https://ljozuzegyoyroasdqdll.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqb3p1emVneW95cm9hc2RxZGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTcyNjksImV4cCI6MjA5MjkzMzI2OX0.YEc7AWOcsSQaTqX0CcsXh9cY0eSWgu3ES8m7luOnsIM';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL).trim().replace(/\/$/, '').replace('/rest/v1', '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
