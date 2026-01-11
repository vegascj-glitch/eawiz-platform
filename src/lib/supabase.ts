// src/lib/supabase.ts
// CLIENT-SAFE ONLY - Do not import server helpers here!
// For server helpers (getProfile, isActiveMember, createServerSupabaseClient),
// import directly from '@/lib/supabase-server'

export { createBrowserSupabaseClient, createClient } from './supabase-browser';
