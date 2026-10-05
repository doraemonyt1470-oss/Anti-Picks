import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabaseClient = null;

if (config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)) {
  const keyToUse = config.supabase.serviceRoleKey || config.supabase.anonKey;
  try {
    supabaseClient = createClient(config.supabase.url, keyToUse, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (err) {
    console.error('[Supabase] Failed to initialize client:', err.message);
  }
}

export const isSupabaseConfigured = () => Boolean(supabaseClient);
export const getSupabase = () => supabaseClient;
