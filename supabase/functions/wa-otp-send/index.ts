// Texts a six-digit sign-in code to the user's WhatsApp.

import { sha256 } from "../_shared/hash.ts";
import { adminClient, HttpError, json, serve } from "../_shared/http.ts";
import { sendWhatsAppText } from "../_shared/whatsapp.ts";

serve(async (req) => {
  const { phone } = await req.json();
  if (typeof phone !== "string" || !/^\+?[1-9]\d{9,14}$/.test(phone)) throw new HttpError(400, "That phone number doesn't look right.");
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  const admin = adminClient();
  await admin.from("otp_codes").upsert({
    phone,
    code_hash: await sha256(`${phone}:${code}`),
    attempts: 0,
    expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
  });
  await sendWhatsAppText(phone, `Your ALMA code is ${code}. It expires in 10 minutes. Don't share it with anyone.`);
  return json({ ok: true });
});
