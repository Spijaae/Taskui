import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2.86.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export function adminClient(): SupabaseClient {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Resolves the calling user from the request's bearer token.
export async function requireUser(req: Request): Promise<{ user: User; admin: SupabaseClient }> {
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  const admin = adminClient();
  if (!token) throw new HttpError(401, "Not signed in");
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, "Not signed in");
  return { user: data.user, admin };
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function serve(handler: (req: Request) => Promise<Response>) {
  Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status);
      console.error(error);
      return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
    }
  });
}
