// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// Minimal safe helpers (so imports compile even before Supabase exists)
export async function getProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return data ?? null;
}

export async function isActiveMember() {
  const profile = await getProfile();
  if (!profile) return false;

  // Adjust this field name if your schema differs.
  // Common patterns: profile.is_active_member, profile.membership_status, profile.plan
  return Boolean((profile as any).is_active_member || (profile as any).active_member);
}
