// Starts the Google Calendar OAuth flow and returns the consent URL.

import { env, json, requireUser, serve } from "../_shared/http.ts";
import { GOOGLE_SCOPES } from "../_shared/google.ts";

serve(async (req) => {
  const { user } = await requireUser(req);
  const state = btoa(JSON.stringify({ uid: user.id, origin: req.headers.get("origin") ?? env("SITE_URL") }));
  const params = new URLSearchParams({
    client_id: env("GOOGLE_CLIENT_ID"),
    redirect_uri: `${env("SUPABASE_URL")}/functions/v1/google-oauth-callback`,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return json({ authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
});
