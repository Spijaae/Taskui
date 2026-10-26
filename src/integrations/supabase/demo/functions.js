// Offline versions of ALMA's edge functions, used in demo mode.

import { toast } from "sonner";

import { appUrl } from "@/lib/appUrl";

import { runChat } from "./assistant";
import { currentUserId, deleteUser, issueOtpToken } from "./auth";
import { commit, getMeta, setMeta, table, uuid } from "./store";
import { TABLES } from "./schema";

export const DEMO_OTP_HINT = "Demo mode: any 6-digit code works (try 123456).";

function httpError(status, body) {
  const response = new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  return {
    data: body,
    error: {
      name: "FunctionsHttpError",
      message: body.error ?? "Edge Function returned a non-2xx status code",
      context: response,
    },
  };
}

// A silent WAV the length of the spoken text, so the player UI behaves while
// the browser's own speech synthesis reads the message aloud.
function silentWav(seconds) {
  const rate = 8000;
  const samples = Math.max(1, Math.round(seconds * rate));
  const buffer = new ArrayBuffer(44 + samples);
  const view = new DataView(buffer);
  const write = (offset, text) => [...text].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  write(0, "RIFF");
  view.setUint32(4, 36 + samples, true);
  write(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  write(36, "data");
  view.setUint32(40, samples, true);
  for (let i = 0; i < samples; i += 1) view.setUint8(44 + i, 128);
  return buffer;
}

function sampleGoogleEvents() {
  const at = (days, hours, minutes = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };
  return [
    { id: "g-standup", summary: "Team stand-up", start: { dateTime: at(0, 10) }, location: "Google Meet" },
    {
      id: "g-dentist",
      summary: "Dentist check-up",
      start: { dateTime: at(2, 15, 30) },
      location: "Smile Dental, High St",
    },
    { id: "g-dinner", summary: "Dinner with Maya", start: { dateTime: at(4, 19) }, location: "Olive & Fig" },
    {
      id: "g-flight",
      summary: "Flight to Lisbon",
      start: { dateTime: at(9, 7, 45) },
      description: "TP 1351 · Terminal 2",
    },
  ];
}

const handlers = {
  "wa-otp-send": ({ body }) => {
    const phone = String(body?.phone ?? "");
    if (!/^\+?[1-9]\d{9,14}$/.test(phone)) return httpError(400, { error: "That phone number doesn't look right." });
    window.setTimeout(() => toast.info(DEMO_OTP_HINT, { duration: 8000 }), 400);
    return { data: { ok: true }, error: null };
  },
  "wa-otp-verify": ({ body }) => {
    if (!/^\d{6}$/.test(String(body?.code ?? ""))) return httpError(400, { error: "That code isn't right." });
    return { data: { hashed_token: issueOtpToken(String(body.phone)) }, error: null };
  },
  "send-welcome": () => ({ data: { ok: true }, error: null }),
  tts: ({ body }) => {
    const text = String(body?.text ?? "");
    try {
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text));
    } catch {}
    const words = text.split(/\s+/).filter(Boolean).length;
    return { data: silentWav(Math.min(120, Math.max(1, words / 2.6))), error: null };
  },
  "transcribe-audio": () => ({
    data: { text: "Voice note recorded. (Transcription needs the live backend; this is demo mode.)" },
    error: null,
  }),
  "analyse-photo": ({ body }) => {
    const seed = String(body?.imageUrl ?? "").length;
    const moods = [
      "A quiet moment worth keeping",
      "A day out, caught in one frame",
      "Something small that made the day",
    ];
    return { data: { caption: moods[seed % moods.length], tags: ["photo", "kept"] }, error: null };
  },
  "google-oauth-init": () => {
    const userId = currentUserId();
    if (!userId) return httpError(401, { error: "Not signed in" });
    const rows = table("google_calendar_tokens");
    if (!rows.some((r) => r.user_id === userId)) {
      rows.push({
        id: uuid(),
        user_id: userId,
        access_token: "demo",
        refresh_token: "demo",
        created_at: new Date().toISOString(),
      });
      commit();
    }
    return { data: { authUrl: appUrl("/calendar?connected=true") }, error: null };
  },
  "get-calendar-events": () => {
    const userId = currentUserId();
    const connected = table("google_calendar_tokens").some((r) => r.user_id === userId);
    if (!connected) return { data: { events: [], reconnect: true }, error: null };
    const created = (getMeta("googleEvents") ?? {})[userId] ?? [];
    return { data: { events: [...sampleGoogleEvents(), ...created] }, error: null };
  },
  "create-calendar-event": ({ body }) => {
    const userId = currentUserId();
    if (!userId) return httpError(401, { error: "Not signed in" });
    const title = String(body?.title ?? "").trim();
    if (!title) return httpError(400, { error: "Give the event a title." });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body?.date ?? ""))) return httpError(400, { error: "Pick a date." });
    const start = new Date(`${body.date}T${body.startTime || "09:00"}:00`);
    if (Number.isNaN(start.getTime())) return httpError(400, { error: "That time isn't valid." });
    const connected = table("google_calendar_tokens").some((r) => r.user_id === userId);
    const googleId = connected ? `g-${uuid()}` : null;
    if (googleId) {
      const all = getMeta("googleEvents") ?? {};
      const end = new Date(start.getTime() + (Number(body.durationMinutes) || 60) * 60000);
      all[userId] = [
        ...(all[userId] ?? []),
        {
          id: googleId,
          summary: title,
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
          location: body.location || undefined,
          description: body.notes || undefined,
        },
      ];
      setMeta("googleEvents", all);
    }
    table("reminders").push({
      ...TABLES.reminders.defaults(),
      id: uuid(),
      user_id: userId,
      event_name: title,
      event_description: [body.location, body.notes].filter(Boolean).join(" · ") || null,
      event_date: body.date,
      reminder_time: start.toISOString(),
      reminder_sent: !body.remindOnWhatsapp,
      google_event_id: googleId,
      tags: ["calendar"],
    });
    commit();
    return {
      data: {
        ok: true,
        message: connected
          ? "Saved to your Google Calendar."
          : "Event saved. Connect Google Calendar to sync it there too.",
      },
      error: null,
    };
  },
  "delete-account": () => {
    const userId = currentUserId();
    if (!userId) return httpError(401, { error: "Not signed in" });
    for (const name of Object.keys(TABLES)) {
      const rows = table(name);
      const keep = rows.filter((r) => r.user_id !== userId);
      rows.length = 0;
      rows.push(...keep);
    }
    commit();
    deleteUser(userId);
    return { data: { ok: true }, error: null };
  },
};

export function createFunctions() {
  return {
    async invoke(name, options = {}) {
      const handler = handlers[name];
      if (!handler) return httpError(404, { error: `Function ${name} is not available in demo mode` });
      await new Promise((r) => setTimeout(r, 250));
      return handler(options);
    },
  };
}

// Streaming endpoints the app calls with fetch().
export async function demoFetchFunction(name, init = {}) {
  const body = init.body ? JSON.parse(init.body) : {};
  const userId = currentUserId();
  if (!userId) return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401 });
  if (name === "chat") {
    const stream = runChat({ userId, ...body });
    return new Response(stream, { status: 200, headers: { "Content-Type": "text/event-stream" } });
  }
  const { data, error } = await createFunctions().invoke(name, { body });
  if (error) return error.context;
  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}
