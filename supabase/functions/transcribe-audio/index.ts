// Speech to text for voice notes recorded in the web app (ElevenLabs Scribe).

import { env, HttpError, json, requireUser, serve } from "../_shared/http.ts";

serve(async (req) => {
  await requireUser(req);
  const { audio } = await req.json();
  if (typeof audio !== "string" || !audio) throw new HttpError(400, "audio (base64) is required");
  const bytes = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: "audio/webm" }), "voice-note.webm");
  form.append("model_id", "scribe_v1");
  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": env("ELEVENLABS_API_KEY") },
    body: form,
  });
  if (!res.ok) throw new HttpError(502, `Transcription failed: ${await res.text()}`);
  const { text } = await res.json();
  return json({ text: String(text ?? "").trim() });
});
