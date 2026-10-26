import { createClient } from "@supabase/supabase-js";

import { createDemoClient, demoFetchFunction } from "./demo";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Without project credentials the app runs against a local demo backend,
// so every screen works out of the box. Set the two env vars to go live.
export const isDemoMode = !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY;

export const supabase = isDemoMode
  ? createDemoClient()
  : createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });

// For edge functions the app streams from (chat) or posts raw payloads to.
export function fetchFunction(name, init) {
  if (isDemoMode) return demoFetchFunction(name, init);
  return fetch(`${SUPABASE_URL}/functions/v1/${name}`, init);
}
