// src/lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Many components expect "createClient" to exist.
// Alias it to the browser client for convenience.
export const createClient = createBrowserSupabaseClient;
