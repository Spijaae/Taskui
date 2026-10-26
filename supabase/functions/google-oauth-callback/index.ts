// Google redirects here after consent; store the tokens and send the user back.

import { adminClient, env } from "../_shared/http.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  let origin = env("SITE_URL");
  try {
    const state = JSON.parse(atob(url.searchParams.get("state") ?? ""));
    origin = state.origin || origin;
    const code = url.searchParams.get("code");
    if (!code) throw new Error(url.searchParams.get("error") ?? "No authorization code");
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env("GOOGLE_CLIENT_ID"),
        client_secret: env("GOOGLE_CLIENT_SECRET"),
        redirect_uri: `${env("SUPABASE_URL")}/functions/v1/google-oauth-callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!res.ok) throw new Error("Google rejected the authorization code");
    const token = await res.json();
    const { error } = await adminClient()
      .from("google_calendar_tokens")
      .upsert(
        {
          user_id: state.uid,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
        },
        { onConflict: "user_id" },
      );
    if (error) throw error;
    return Response.redirect(`${origin}/calendar?connected=true`, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection failed";
    return Response.redirect(`${origin}/calendar?error=${encodeURIComponent(message)}`, 302);
  }
});
