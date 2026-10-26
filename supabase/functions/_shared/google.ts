import type { SupabaseClient } from "npm:@supabase/supabase-js@2.86.0";

import { env } from "./http.ts";

export const GOOGLE_SCOPES = "https://www.googleapis.com/auth/calendar.events";

// Returns a usable access token for the user, refreshing it when it has expired.
export async function googleAccessToken(admin: SupabaseClient, userId: string): Promise<string | null> {
  const { data } = await admin.from("google_calendar_tokens").select("*").eq("user_id", userId).maybeSingle();
  if (!data) return null;
  if (data.expires_at && new Date(data.expires_at).getTime() > Date.now() + 60_000) return data.access_token;
  if (!data.refresh_token) return null;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("GOOGLE_CLIENT_ID"),
      client_secret: env("GOOGLE_CLIENT_SECRET"),
      refresh_token: data.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const token = await res.json();
  await admin
    .from("google_calendar_tokens")
    .update({
      access_token: token.access_token,
      expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
    })
    .eq("user_id", userId);
  return token.access_token;
}
