// Sends a short welcome on WhatsApp once a new account has a phone number.

import { HttpError, json, requireUser, serve } from "../_shared/http.ts";
import { sendWhatsAppText } from "../_shared/whatsapp.ts";

serve(async (req) => {
  const { user, admin } = await requireUser(req);
  const { user_id } = await req.json().catch(() => ({}));
  if (user_id && user_id !== user.id) throw new HttpError(403, "Forbidden");
  const { data: profile } = await admin.from("profiles").select("phone, display_name").eq("user_id", user.id).maybeSingle();
  if (!profile?.phone || !Deno.env.get("WHATSAPP_ACCESS_TOKEN")) return json({ ok: true, sent: false });
  const name = profile.display_name ? ` ${profile.display_name.split(" ")[0]}` : "";
  await sendWhatsAppText(
    profile.phone,
    `Hi${name}, I'm Alma. Send me a voice note, a photo or a few words whenever something is worth keeping, and ask me about it any time.`,
  );
  return json({ ok: true, sent: true });
});
