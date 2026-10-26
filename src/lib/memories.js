const MONTHS = [
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
function startOfDay(e) {
  return new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
}
export function relativeAge(e, t) {
  if (!e) {
    return "";
  }
  const n = new Date(e);
  if (Number.isNaN(n.getTime())) {
    return "";
  }
  const r = Math.abs(Math.round((startOfDay(t) - startOfDay(n)) / 86400000));
  if (r === 0) {
    return "Today";
  }
  if (r === 1) {
    return "1 Day";
  }
  if (r < 7) {
    return `${r} Days`;
  }
  if (r < 14) {
    return "1 Week";
  }
  if (r < 28) {
    return `${Math.floor(r / 7)} Weeks`;
  }
  if (r < 365) {
    const i = Math.floor(r / 30);
    if (i === 1) {
      return "1 Month";
    }
    return `${i} Months`;
  }
  const s = Math.floor(r / 365);
  if (s === 1) {
    return "1 Year";
  }
  return `${s} Years`;
}
export function formatMemoryDate(e, t) {
  if (t) {
    const n = new Date(t);
    if (!Number.isNaN(n.getTime())) {
      const r = n.getHours();
      const s = r < 12 ? "AM" : "PM";
      const i = r % 12 === 0 ? 12 : r % 12;
      const o = String(n.getMinutes()).padStart(2, "0");
      return `${n.getDate()} ${MONTHS[n.getMonth()]} ${n.getFullYear()}, ${i}:${o} ${s}`;
    }
  }
  if (e) {
    const n = e.split("-");
    if (n.length === 3) {
      const [r, s, i] = n.map(Number);
      if (MONTHS[s - 1]) {
        return `${i} ${MONTHS[s - 1]} ${r}`;
      }
    }
    return e;
  }
  return "—";
}
export function matchesQuery(e, ...t) {
  const n = e.trim().toLowerCase();
  if (n === "") {
    return true;
  }
  return t.some((r) => (r ?? "").toLowerCase().includes(n));
}
export function firstNonEmpty(e) {
  const t = e?.find((n) => n.trim().length > 0);
  if (t) {
    return t.trim();
  }
  return null;
}
export function splitTitle(e) {
  const title = (e ?? "").trim();
  if (!title) {
    return {
      title: "Untitled",
      body: "",
    };
  }
  const n = title.indexOf(`
`);
  if (n > 0 && n <= 80) {
    return {
      title: title.slice(0, n).trim(),
      body: title.slice(n + 1).trim(),
    };
  }
  const r = title.search(/[.!?](\s|$)/);
  if (r > 0 && r <= 80) {
    return {
      title: title.slice(0, r + 1).trim(),
      body: title.slice(r + 1).trim(),
    };
  }
  if (title.length <= 80) {
    return {
      title,
      body: "",
    };
  }
  const s = title.slice(0, 60);
  const i = s.lastIndexOf(" ");
  const o = (i >= 20 ? s.slice(0, i) : s).trim();
  return {
    title: `${o}…`,
    body: title.slice(o.length).trim(),
  };
}
const KIND_LABELS = {
  photo: "Photo",
  voice: "Voice note",
  note: "Note",
};
export function kindLabel(kind) {
  return KIND_LABELS[kind];
}
function tokenize(e) {
  return e
    .toLowerCase()
    .split(/[^a-z0-9']+/i)
    .filter((t) => t.length > 1);
}
function searchableText(memory) {
  return [memory.title, memory.content, memory.tags.join(" "), memory.place ?? ""].join(" ").toLowerCase();
}
function scoreMemory(memory, t) {
  if (t.length === 0) {
    return null;
  }
  const n = memory.title.toLowerCase();
  const r = searchableText(memory);
  const s = memory.entityNames.map((l) => l.toLowerCase());
  let score = 0;
  let viaAlias = false;
  let a = 0;
  for (const l of t) {
    let c = false;
    if (n.includes(l)) {
      score += 5;
      c = true;
    } else if (r.includes(l)) {
      score += 3;
      c = true;
    }
    if (s.some((d) => d.includes(l))) {
      score += 2;
      if (!c) {
        viaAlias = true;
      }
      c = true;
    }
    if (c) {
      a += 1;
    }
  }
  if (a === 0) {
    return null;
  }
  return (
    (score += a === t.length ? 4 : 0),
    {
      memory,
      score,
      viaAlias,
    }
  );
}
export function rankMemories(e, t, n = 8) {
  const r = tokenize(t);
  if (r.length === 0) {
    return [];
  }
  return e
    .map((s) => scoreMemory(s, r))
    .filter((s) => s !== null)
    .sort((s, i) => i.score - s.score || new Date(i.memory.takenAt).getTime() - new Date(s.memory.takenAt).getTime())
    .slice(0, n);
}
export function matchPeople(e, t, n = 4) {
  const r = tokenize(t);
  if (r.length === 0) {
    return [];
  }
  return e
    .filter((s) => {
      const i = [s.name, ...s.aliases].map((o) => o.toLowerCase());
      return r.some((o) => i.some((a) => a.includes(o)));
    })
    .sort((s, i) => i.memoryCount - s.memoryCount)
    .slice(0, n);
}
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
function monthYear(e) {
  const t = new Date(e);
  return `${MONTH_NAMES[t.getMonth()]} ${t.getFullYear()}`;
}
export function summarizeResults(e, t) {
  if (e.length === 0) {
    return null;
  }
  const r = [...new Set(e.map((d) => d.memory.kind))]
    .map((d) => {
      switch (d) {
        case "photo":
          return "photos";
        case "voice":
          return "voice notes";
        default:
          return "notes";
      }
    })
    .sort();
  const s = r.length === 1 ? r[0] : `${r.slice(0, -1).join(", ")} and ${r[r.length - 1]}`;
  const i = e
    .map((d) => new Date(d.memory.takenAt).getTime())
    .filter((d) => !Number.isNaN(d))
    .sort((d, h) => d - h);
  let o = "";
  if (i.length > 0) {
    const d = monthYear(new Date(i[0]).toISOString());
    const h = monthYear(new Date(i[i.length - 1]).toISOString());
    o = d === h ? ` from ${d}` : ` from ${d} to ${h}`;
  }
  const a = t.length > 0 ? ` connected to ${t[0].name}` : "";
  const c = e.some((d) => d.viaAlias) && t.length > 0 ? `, including some that never name ${t[0].name}` : "";
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}${a}${o}${c}.`;
}
export function memoryMeta(memory) {
  const t = new Date(memory.takenAt);
  const n = Number.isNaN(t.getTime())
    ? null
    : t.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  return [kindLabel(memory.kind), n, memory.place].filter(Boolean).join(" · ");
}
