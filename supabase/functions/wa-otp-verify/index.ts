// Checks a WhatsApp code and returns a one-time token the client exchanges
// with supabase.auth.verifyOtp({ token_hash, type: "email" }).

import { sha256 } from "../_shared/hash.ts";
import { adminClient, HttpError, json, serve } from "../_shared/http.ts";
import { phoneEmail } from "../_shared/whatsapp.ts";

serve(async (req) => {
  const { phone, code } = await req.json();
  if (typeof phone !== "string" || !/^\d{6}$/.test(String(code))) throw new HttpError(400, "That code isn't right.");
  const admin = adminClient();
  const { data: row } = await admin.from("otp_codes").select("*").eq("phone", phone).maybeSingle();
  if (!row || new Date(row.expires_at).getTime() < Date.now()) throw new HttpError(400, "That code has expired. Ask for a new one.");
  if (row.attempts >= 5) throw new HttpError(429, "Too many attempts. Ask for a new code.");
  if ((await sha256(`${phone}:${code}`)) !== row.code_hash) {
    await admin.from("otp_codes").update({ attempts: row.attempts + 1 }).eq("phone", phone);
    throw new HttpError(400, "That code isn't right.");
  }
  await admin.from("otp_codes").delete().eq("phone", phone);

  const email = phoneEmail(phone);
  const { data: link, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { data: { phone } },
  });
  if (error) {
    // First sign-in: create the account, then mint the link.
    const created = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: { phone } });
    if (created.error) throw new HttpError(500, created.error.message);
    const retry = await admin.auth.admin.generateLink({ type: "magiclink", email });
    if (retry.error) throw new HttpError(500, retry.error.message);
    return json({ hashed_token: retry.data.properties.hashed_token });
  }
  return json({ hashed_token: link.properties.hashed_token });
});
