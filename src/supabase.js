import { createClient } from '@supabase/supabase-js';

// !! IMPORTANT:
// !! Store these in .env.local and access them with
// !! process.env.REACT_APP_SUPABASE_URL or import.meta.env.VITE_SUPABASE_URL
// !! Never expose your *service_role* key in the browser!
const supurl = import.meta.env.SUPABASEMAIN_URL;
const supkey = import.meta.env.SUPABASEMAIN_KEY;

const supabaseUrl = supurl;
const supabaseAnonKey = supkey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);