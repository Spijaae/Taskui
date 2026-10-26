import { env } from "./http.ts";

// Sends a plain text WhatsApp message through the Meta Cloud API.
export async function sendWhatsAppText(phone: string, body: string): Promise<void> {
  const to = phone.replace(/[^\d]/g, "");
  const res = await fetch(`https://graph.facebook.com/v21.0/${env("WHATSAPP_PHONE_NUMBER_ID")}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env("WHATSAPP_ACCESS_TOKEN")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body } }),
  });
  if (!res.ok) throw new Error(`WhatsApp send failed: ${await res.text()}`);
}

// Phone users sign in through a synthetic email so Supabase can mint a magic-link token.
export function phoneEmail(phone: string): string {
  return `wa+${phone.replace(/[^\d]/g, "")}@${Deno.env.get("WA_EMAIL_DOMAIN") ?? "phone.meetalma.ai"}`;
}
