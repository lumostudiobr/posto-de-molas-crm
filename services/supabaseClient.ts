import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Key is missing. If you are in production (Vercel), please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your project Environment Variables in the Vercel Dashboard.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
