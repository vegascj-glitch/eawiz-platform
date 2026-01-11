// src/lib/supabase-server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Profile } from '@/types/database';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // If called from a Server Component, this can fail silently.
            // It's fine for build-time / read-only scenarios.
          }
        },
      },
    }
  );
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

function isInternalMember(email: string | undefined): boolean {
  if (!email) return false;
  const internalEmails = process.env.INTERNAL_MEMBER_EMAILS || '';
  if (!internalEmails) return false;

  const allowedEmails = internalEmails
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.toLowerCase().trim());
}

export async function isActiveMember(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check internal member bypass first
  if (user?.email && isInternalMember(user.email)) {
    return true;
  }

  const profile = await getProfile();
  if (!profile) {
    return false;
  }
  return profile.subscription_status === 'active';
}
