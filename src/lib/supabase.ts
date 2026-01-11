// src/lib/supabase.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * CLIENT: use inside "use client" components ONLY
 * Safe: does not import next/headers at the top level.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * SERVER: use inside Server Components / Route Handlers ONLY
 * IMPORTANT: next/headers is imported *inside* the function so this file
 * can still be imported by client code without build errors.
 */
export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers');

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookies().set({ name, value, ...options });
          } catch {
            // If called in a context where cookies can't be set, ignore safely.
          }
        },
        remove(name: string, options: any) {
          try {
            cookies().set({ name, value: '', ...options });
          } catch {
            // Ignore safely
          }
        },
      },
    }
  );
}

/**
 * Backwards-compatible alias:
 * If some files call createClient() expecting a browser client, this supports that.
 */
export function createClient() {
  return createBrowserSupabaseClient();
}

/**
 * Convenience helpers (used by server pages in the scaffold)
 * These are safe even if Supabase isn't fully configured yet (they’ll just return null/false).
 */
export async function getProfile() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data_pages, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return data_pages ?? null;
  } catch {
    return null;
  }
}

export async function isActiveMember() {
  try {
    const profile: any = await getProfile();
    return Boolean(profile?.membership_status === 'active');
  } catch {
    return false;
  }
}
