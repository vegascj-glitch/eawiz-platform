// src/lib/supabase.ts
// "Barrel" exports used across the app.
// IMPORTANT: Do NOT import this file inside "use client" components if it causes server-only bundling.
// If you hit server/client boundary issues, import from:
// - "@/lib/supabase-browser" in client components
// - "@/lib/supabase-server" in server components / route handlers

export { createBrowserSupabaseClient, createClient } from './supabase-browser';
export {
  createServerSupabaseClient,
  getProfile,
  isActiveMember,
} from './supabase-server';
