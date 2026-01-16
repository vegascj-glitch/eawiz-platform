/**
 * Storage utilities for the Executive Profile tool
 * Tier 1: Supabase (logged-in member)
 * Tier 2: localStorage fallback
 */

import { ProfileState, createEmptyState, isValidProfileState } from './types';

const TOOL_KEY = 'executive_profile';
const LOCAL_STORAGE_KEY = 'eawiz:tool:executive_profile';

interface StorageResult {
  success: boolean;
  data?: ProfileState;
  error?: string;
  isLocal?: boolean;
}

/**
 * Get Supabase client safely at runtime
 * Returns null if env vars are missing or client creation fails
 */
async function getSupabaseClient() {
  // Check env vars at runtime, not import time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    // Dynamic import to avoid build-time issues
    const { createBrowserClient } = await import('@supabase/ssr');
    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch {
    return null;
  }
}

/**
 * Get current user ID from Supabase
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

/**
 * Save state to localStorage
 */
function saveToLocalStorage(state: ProfileState): boolean {
  try {
    const stateWithTimestamp = {
      ...state,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateWithTimestamp));
    return true;
  } catch {
    return false;
  }
}

/**
 * Load state from localStorage
 */
function loadFromLocalStorage(): ProfileState | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (isValidProfileState(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save state to Supabase
 */
async function saveToSupabase(state: ProfileState, userId: string): Promise<boolean> {
  const supabase = await getSupabaseClient();
  if (!supabase) return false;

  try {
    const stateWithTimestamp = {
      ...state,
      lastSaved: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('tool_state')
      .upsert(
        {
          user_id: userId,
          tool_key: TOOL_KEY,
          state_json: stateWithTimestamp,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,tool_key',
        }
      );

    return !error;
  } catch {
    return false;
  }
}

/**
 * Load state from Supabase
 */
async function loadFromSupabase(userId: string): Promise<ProfileState | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('tool_state')
      .select('state_json')
      .eq('user_id', userId)
      .eq('tool_key', TOOL_KEY)
      .single();

    if (error || !data) return null;

    const stateJson = data.state_json;
    if (isValidProfileState(stateJson)) {
      return stateJson;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Main save function with fallback
 */
export async function saveProfileState(state: ProfileState): Promise<StorageResult> {
  const userId = await getCurrentUserId();

  // Try Supabase first if user is logged in
  if (userId) {
    const supabaseSuccess = await saveToSupabase(state, userId);
    if (supabaseSuccess) {
      return { success: true, isLocal: false };
    }
  }

  // Fallback to localStorage
  const localSuccess = saveToLocalStorage(state);
  if (localSuccess) {
    return { success: true, isLocal: true };
  }

  return { success: false, error: 'Failed to save data' };
}

/**
 * Main load function with fallback
 */
export async function loadProfileState(): Promise<StorageResult> {
  const userId = await getCurrentUserId();

  // Try Supabase first if user is logged in
  if (userId) {
    const supabaseData = await loadFromSupabase(userId);
    if (supabaseData) {
      return { success: true, data: supabaseData, isLocal: false };
    }
  }

  // Fallback to localStorage
  const localData = loadFromLocalStorage();
  if (localData) {
    return { success: true, data: localData, isLocal: true };
  }

  // Return empty state if nothing found
  return { success: true, data: createEmptyState(), isLocal: true };
}

/**
 * Export state as JSON string
 */
export function exportStateAsJson(state: ProfileState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Import state from JSON string
 */
export function importStateFromJson(jsonString: string): StorageResult {
  try {
    const parsed = JSON.parse(jsonString);
    if (isValidProfileState(parsed)) {
      return { success: true, data: parsed };
    }
    return { success: false, error: 'Invalid data format. Must have fields and tables keys.' };
  } catch {
    return { success: false, error: 'Invalid JSON format' };
  }
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId !== null;
}
