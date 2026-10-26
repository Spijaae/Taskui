const PHOTO_TYPES = new Set(["photo", "image", "picture"]);
const VOICE_TYPES = new Set(["voice", "audio", "voice_note", "voicenote"]);
export function normalizeKind(t) {
  const e = String(t ?? "").toLowerCase();
  if (PHOTO_TYPES.has(e)) {
    return "photo";
  }
  if (VOICE_TYPES.has(e)) {
    return "voice";
  }
  return "note";
}
export function normalizeProcessing(t) {
  if (t === "pending" || t === "failed") {
    return t;
  }
  return "complete";
}
function memoryDate(t) {
  if (t.event_date) {
    return {
      at: new Date(`${t.event_date}T12:00:00`).toISOString(),
      atIsEstimated: !!t.event_date_is_estimated,
    };
  }
  return {
    at: t.timestamp ?? new Date(0).toISOString(),
    atIsEstimated: true,
  };
}
function firstAttachmentUrl(t) {
  const e = t?.attachments;
  if (Array.isArray(e) && typeof e[0]?.url === "string") {
    return e[0].url;
  }
}
function longestDuration(t) {
  let e = null;
  for (const n of t ?? []) {
    const o = n?.duration_seconds;
    if (o == null || o === "") {
      continue;
    }
    const i = Number(o);
    if (!(!Number.isFinite(i) || i < 0)) {
      if (e === null || i > e) {
        e = i;
      }
    }
  }
  return e;
}
export function formatClock(t) {
  if (typeof t !== "number" || !Number.isFinite(t) || t < 0) {
    return null;
  }
  const e = Math.round(t);
  const n = Math.floor(e / 3600);
  const o = Math.floor((e % 3600) / 60);
  const i = e % 60;
  const r = (a) => String(a).padStart(2, "0");
  if (n > 0) {
    return `${n}:${r(o)}:${r(i)}`;
  }
  return `${o}:${r(i)}`;
}
function galleryImageId(metadata) {
  const e = metadata?.gallery_image_id;
  if (typeof e === "string") {
    return e;
  }
  return null;
}
export function toVaultEntry(t, entityNames = []) {
  const { at, atIsEstimated } = memoryDate(t);
  return {
    id: t.id,
    source: "memory",
    kind: normalizeKind(t.type),
    title: t.title?.trim() || null,
    summary: t.summary?.trim() || null,
    content: (t.content ?? "").trim(),
    tags: t.tags ?? [],
    thumbnailUrl: firstAttachmentUrl(t.metadata),
    at,
    atIsEstimated,
    isCore: t.is_core === true,
    processing: normalizeProcessing(t.processing_state),
    entityNames,
    durationSeconds: longestDuration(t.memory_media),
  };
}
export function mergeVaultEntries(t, e, n = {}) {
  const o = new Set();
  const i = [];
  for (const a of t ?? []) {
    const s = galleryImageId(a.metadata);
    if (s) {
      o.add(s);
    }
    i.push(toVaultEntry(a, n[a.id] ?? []));
  }
  for (const a of e ?? []) {
    if (!o.has(a.id)) {
      i.push({
        id: a.id,
        source: "gallery",
        kind: "photo",
        title: a.file_name?.trim() || null,
        summary: null,
        content: "",
        tags: [],
        thumbnailUrl: a.file_url ?? undefined,
        at: a.created_at ?? new Date(0).toISOString(),
        atIsEstimated: true,
        isCore: false,
        processing: "complete",
        entityNames: [],
        durationSeconds: null,
      });
    }
  }
  return i.sort((a, s) => new Date(s.at).getTime() - new Date(a.at).getTime());
}
export const DEFAULT_FILTERS = {
  kind: "all",
  coreOnly: false,
};
export function applyFilters(t, e) {
  return (t ?? []).filter((n) => !((e.kind !== "all" && n.kind !== e.kind) || (e.coreOnly && !n.isCore)));
}
export function entryTitle(t) {
  if (t.title) {
    return t.title;
  }
  const e = t.content
    .split(
      `
`,
    )
    .map((n) => n.trim())
    .find(Boolean);
  if (e) {
    if (e.length > 80) {
      return `${e.slice(0, 79).trimEnd()}…`;
    }
    return e;
  }
  if (t.kind === "photo") {
    return "Photo";
  }
  if (t.kind === "voice") {
    return "Voice note";
  }
  return "Note";
}
export function groupByMonth(t) {
  const e = new Map();
  for (const n of t ?? []) {
    const o = new Date(n.at);
    if (Number.isNaN(o.getTime())) {
      continue;
    }
    const i = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`;
    let r = e.get(i);
    if (!r) {
      r = {
        key: i,
        label: o.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        }),
        entries: [],
      };
      e.set(i, r);
    }
    r.entries.push(n);
  }
  return [...e.values()].sort((n, o) => o.key.localeCompare(n.key));
}
export function emptyStateMessage(t, e, n) {
  if (n === 0) {
    return "Nothing kept yet. Send Alma a thought, a photo or a voice note and it will show up here.";
  }
  const o = e.trim();
  const i = [];
  if (t.coreOnly) {
    i.push("core memories");
  }
  if (t.kind !== "all") {
    i.push(t.kind === "photo" ? "photos" : t.kind === "voice" ? "voice notes" : "notes");
  }
  if (o && i.length) {
    return `Nothing matching “${o}” in ${i.join(" and ")}. Try clearing a filter, or search everything you've kept.`;
  }
  if (o) {
    return `Nothing matching “${o}”. Alma won't invent a memory it doesn't have.`;
  }
  if (i.length) {
    return `You haven't got any ${i.join(" that are ")} yet.`;
  }
  return "Nothing to show.";
}
