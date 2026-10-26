// Reads an ALMA reply aloud (ElevenLabs text to speech, MP3).

import { corsHeaders, env, HttpError, requireUser, serve } from "../_shared/http.ts";

serve(async (req) => {
  await requireUser(req);
  const { text } = await req.json();
  if (typeof text !== "string" || !text.trim()) throw new HttpError(400, "text is required");
  const voice = Deno.env.get("ELEVENLABS_VOICE_ID") ?? "21m00Tcm4TlvDq8ikWAM";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": env("ELEVENLABS_API_KEY"), "Content-Type": "application/json" },
    body: JSON.stringify({ text: text.slice(0, 4000), model_id: "eleven_multilingual_v2" }),
  });
  if (!res.ok) throw new HttpError(502, `Speech failed: ${await res.text()}`);
  return new Response(res.body, { headers: { ...corsHeaders, "Content-Type": "audio/mpeg" } });
});
