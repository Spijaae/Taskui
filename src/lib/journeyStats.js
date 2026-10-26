const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function dayStart(t) {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
}
function dayKey(t) {
  return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
}
function validDates(t) {
  const e = [];
  for (const o of t) {
    if (!o) {
      continue;
    }
    const n = new Date(o);
    if (!Number.isNaN(n.getTime())) {
      e.push(n);
    }
  }
  return e;
}
export function weeklyBuckets(t, e, length) {
  const n = dayStart(e);
  const r = Array.from(
    {
      length,
    },
    (s, u) => {
      const offsetWeeks = length - 1 - u;
      const startedAt = new Date(n - (offsetWeeks * 7 + 6) * 86400000);
      return {
        offsetWeeks,
        count: 0,
        month: MONTH_ABBR[startedAt.getMonth()],
        startedAt,
      };
    },
  );
  for (const s of validDates(t)) {
    const u = Math.round((n - dayStart(s)) / 86400000);
    if (u < 0) {
      continue;
    }
    const a = Math.floor(u / 7);
    if (!(a >= length)) {
      r[length - 1 - a].count += 1;
    }
  }
  return r;
}
export function monthMarkers(t) {
  const e = [];
  let o = "";
  t.forEach((n, index) => {
    if (n.month !== o) {
      e.push({
        index,
        label: n.month,
      });
      o = n.month;
    }
  });
  return e;
}
export function activeDays(t) {
  const e = new Set();
  for (const o of validDates(t)) {
    e.add(dayKey(o));
  }
  return e.size;
}
export function currentStreak(t, e) {
  const o = new Set();
  for (const u of validDates(t)) {
    o.add(dayKey(u));
  }
  if (o.size === 0) {
    return 0;
  }
  const n = dayStart(e);
  let r = n;
  if (!o.has(dayKey(new Date(r))) && ((r = n - 86400000), !o.has(dayKey(new Date(r))))) {
    return 0;
  }
  let s = 0;
  while (o.has(dayKey(new Date(r)))) {
    s += 1;
    r -= 86400000;
  }
  return s;
}
export function busiestMonth(t) {
  const e = new Map();
  for (const r of validDates(t)) {
    e.set(r.getMonth(), (e.get(r.getMonth()) ?? 0) + 1);
  }
  if (e.size === 0) {
    return null;
  }
  let o = -1;
  let n = -1;
  for (const [r, s] of e) {
    if (s > n) {
      o = r;
      n = s;
    }
  }
  return MONTH_NAMES[o];
}
export function journeySummary(t) {
  if (t.memories === 0) {
    return "Nothing kept yet. Tell Alma one thing worth remembering and this page starts filling in.";
  }
  const e = [];
  e.push(
    t.days <= 1
      ? `You started today, with ${t.memories} ${t.memories === 1 ? "memory" : "memories"} kept.`
      : `You've kept ${t.memories} ${t.memories === 1 ? "memory" : "memories"} across ${t.days} separate days.`,
  );
  if (t.busiest) {
    e.push(`${t.busiest} was your fullest month.`);
  }
  if (t.voiceNotes > 0) {
    e.push(
      `${t.voiceNotes} of them ${t.voiceNotes === 1 ? "is a voice note" : "are voice notes"} — sound you would not otherwise still have.`,
    );
  }
  if (t.revisited > 0) {
    e.push(`Alma has brought ${t.revisited} of them back to you since.`);
  }
  return e.join(" ");
}
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function mostCommon(t) {
  if (t.length === 0) {
    return null;
  }
  const e = new Map();
  for (const r of t) {
    e.set(r, (e.get(r) ?? 0) + 1);
  }
  let o = -1;
  let n = -1;
  for (const [r, s] of e) {
    if (s > n) {
      o = r;
      n = s;
    }
  }
  return o;
}
export function rhythmLine(t) {
  const e = validDates(t);
  if (e.length === 0) {
    return null;
  }
  const o = mostCommon(e.map((s) => s.getDay()));
  const n = mostCommon(
    e.map((s) => {
      const u = s.getHours();
      if (u < 12) {
        return 0;
      }
      if (u < 17) {
        return 1;
      }
      if (u < 22) {
        return 2;
      }
      return 3;
    }),
  );
  if (o === null || n === null) {
    return null;
  }
  const r = ["mornings", "afternoons", "evenings", "late nights"][n];
  return `Most of them arrived on ${WEEKDAYS[o]} ${r}. That's what a life mostly is.`;
}
export function voiceTotals(t, e) {
  let seconds = 0;
  let recorded = 0;
  for (const r of t ?? []) {
    if (!(typeof r !== "number" || !Number.isFinite(r) || r < 0)) {
      seconds += r;
      recorded += 1;
    }
  }
  return {
    seconds,
    recorded,
    total: Math.max(e, recorded),
  };
}
export function formatDuration(t) {
  const e = Math.round(t);
  if (e <= 0) {
    return "0m";
  }
  const o = Math.floor(e / 3600);
  const n = Math.floor((e % 3600) / 60);
  if (o > 0) {
    if (n > 0) {
      return `${o}h ${n}m`;
    }
    return `${o}h`;
  }
  if (n > 0) {
    return `${n}m`;
  }
  return `${e}s`;
}
export function missingLengthNote(t) {
  const e = t.total - t.recorded;
  if (e <= 0) {
    return null;
  }
  if (t.recorded === 0) {
    return `length isn't recorded for ${e === 1 ? "your voice note" : `any of your ${e} voice notes`} yet`;
  }
  return `${e} older ${e === 1 ? "note has" : "notes have"} no length on record`;
}
