import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// Clean the URL (remove trailing slashes or /rest/v1/ if the user accidentally included them)
const supabaseUrl = rawUrl.replace(/\/$/, '').replace('/rest/v1', '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
