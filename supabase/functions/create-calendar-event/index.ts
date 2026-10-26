// Saves an event as an ALMA reminder and, when connected, to Google Calendar.

import { HttpError, json, requireUser, serve } from "../_shared/http.ts";
import { googleAccessToken } from "../_shared/google.ts";

function zonedIso(date: string, time: string, timeZone: string): Date {
  // Interpret "date time" as wall-clock time in the user's timezone.
  const guess = new Date(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(guess);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(guess.getTime() - (asUtc - guess.getTime()));
}

serve(async (req) => {
  const { user, admin } = await requireUser(req);
  const { title, date, startTime = "09:00", durationMinutes = 60, location, notes, remindOnWhatsapp = true, timezone = "UTC" } =
    await req.json();
  if (!String(title ?? "").trim()) throw new HttpError(400, "Give the event a title.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) throw new HttpError(400, "Pick a date.");
  if (!/^\d{2}:\d{2}$/.test(String(startTime))) throw new HttpError(400, "That time isn't valid.");
  const start = zonedIso(date, startTime, timezone);
  const end = new Date(start.getTime() + Number(durationMinutes || 60) * 60_000);

  let googleEventId: string | null = null;
  const token = await googleAccessToken(admin, user.id);
  if (token) {
    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: title,
        location: location || undefined,
        description: notes || undefined,
        start: { dateTime: start.toISOString(), timeZone: timezone },
        end: { dateTime: end.toISOString(), timeZone: timezone },
      }),
    });
    if (res.ok) googleEventId = (await res.json()).id;
  }

  const { error } = await admin.from("reminders").insert({
    user_id: user.id,
    event_name: String(title).trim(),
    event_description: [location, notes].filter(Boolean).join(" · ") || null,
    event_date: date,
    reminder_time: start.toISOString(),
    reminder_sent: !remindOnWhatsapp,
    google_event_id: googleEventId,
    tags: ["calendar"],
  });
  if (error) throw new HttpError(500, error.message);
  return json({
    ok: true,
    message: googleEventId ? "Saved to your Google Calendar." : "Event saved. Connect Google Calendar to sync it there too.",
  });
});
