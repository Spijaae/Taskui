// Upcoming Google Calendar events for the calendar screen.

import { json, requireUser, serve } from "../_shared/http.ts";
import { googleAccessToken } from "../_shared/google.ts";

serve(async (req) => {
  const { user, admin } = await requireUser(req);
  const token = await googleAccessToken(admin, user.id);
  if (!token) return json({ events: [], reconnect: true });
  const params = new URLSearchParams({
    timeMin: new Date(Date.now() - 31 * 86400_000).toISOString(),
    timeMax: new Date(Date.now() + 92 * 86400_000).toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) return json({ events: [], reconnect: true });
  if (!res.ok) return json({ error: "Couldn't load Google events" }, 502);
  const body = await res.json();
  return json({ events: body.items ?? [] });
});
