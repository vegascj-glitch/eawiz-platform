/**
 * Storage utilities for the Charitable Deductions Calculator
 * Tier 1: Supabase (logged-in member)
 * Tier 2: localStorage fallback
 *
 * Uses existing tool_state table with tool_key = 'charitable_deductions_2025'
 */

import { QuantityMap, STORAGE_KEY } from './utils';

const TOOL_KEY = 'charitable_deductions_2025';

interface SavedState {
  quantities: QuantityMap;
  updatedAt: string;
}

interface StorageResult {
  success: boolean;
  data?: SavedState;
  error?: string;
  isLocal?: boolean;
}

/**
 * Get Supabase client safely at runtime
 */
async function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
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
function saveToLocalStorage(state: SavedState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/**
 * Load state from localStorage
 */
function loadFromLocalStorage(): SavedState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.quantities === 'object') {
      return {
        quantities: parsed.quantities || {},
        updatedAt: parsed.updatedAt || null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clear localStorage
 */
function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Save state to Supabase
 */
async function saveToSupabase(state: SavedState, userId: string): Promise<boolean> {
  const supabase = await getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('tool_state')
      .upsert(
        {
          user_id: userId,
          tool_key: TOOL_KEY,
          state_json: state,
          updated_at: state.updatedAt,
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
async function loadFromSupabase(userId: string): Promise<SavedState | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('tool_state')
      .select('state_json, updated_at')
      .eq('user_id', userId)
      .eq('tool_key', TOOL_KEY)
      .single();

    if (error || !data) return null;

    const stateJson = data.state_json as SavedState;
    if (stateJson && typeof stateJson.quantities === 'object') {
      return {
        quantities: stateJson.quantities || {},
        updatedAt: stateJson.updatedAt || data.updated_at,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clear Supabase state
 */
async function clearSupabase(userId: string): Promise<boolean> {
  const supabase = await getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('tool_state')
      .delete()
      .eq('user_id', userId)
      .eq('tool_key', TOOL_KEY);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Main save function - saves to both localStorage and Supabase
 */
export async function saveDeductionsState(quantities: QuantityMap): Promise<StorageResult> {
  const state: SavedState = {
    quantities,
    updatedAt: new Date().toISOString(),
  };

  // Always save to localStorage first for instant feedback
  saveToLocalStorage(state);

  const userId = await getCurrentUserId();

  // Try Supabase if user is logged in
  if (userId) {
    const supabaseSuccess = await saveToSupabase(state, userId);
    if (supabaseSuccess) {
      return { success: true, isLocal: false };
    }
  }

  return { success: true, isLocal: true };
}

/**
 * Main load function - loads from Supabase first, then localStorage
 */
export async function loadDeductionsState(): Promise<StorageResult> {
  const userId = await getCurrentUserId();

  // Load from localStorage first for instant render
  const localData = loadFromLocalStorage();

  // Try Supabase if user is logged in
  if (userId) {
    const supabaseData = await loadFromSupabase(userId);
    if (supabaseData) {
      // Compare timestamps - use newer data
      if (localData && localData.updatedAt) {
        const localTime = new Date(localData.updatedAt).getTime();
        const supabaseTime = new Date(supabaseData.updatedAt).getTime();

        if (localTime > supabaseTime) {
          // Local is newer, sync to Supabase
          await saveToSupabase(localData, userId);
          return { success: true, data: localData, isLocal: false };
        }
      }

      // Supabase is newer or same, use it and sync to local
      saveToLocalStorage(supabaseData);
      return { success: true, data: supabaseData, isLocal: false };
    }
  }

  // Return local data or empty state
  if (localData) {
    return { success: true, data: localData, isLocal: true };
  }

  return {
    success: true,
    data: { quantities: {}, updatedAt: new Date().toISOString() },
    isLocal: true
  };
}

/**
 * Clear all saved state
 */
export async function clearDeductionsState(): Promise<StorageResult> {
  // Clear localStorage
  clearLocalStorage();

  const userId = await getCurrentUserId();

  // Clear Supabase if user is logged in
  if (userId) {
    await clearSupabase(userId);
  }

  return { success: true };
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId !== null;
}
