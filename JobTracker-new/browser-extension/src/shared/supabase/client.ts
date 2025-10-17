import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@jobtracker/database';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
  }

  return supabaseClient;
}

export function setSupabaseSession(session: Session | null) {
  const client = getSupabaseClient();
  if (session) {
    void client.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
  } else {
    void client.auth.signOut();
  }
}
