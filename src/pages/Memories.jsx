import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileTopBar } from "@/components/MobileTopBar";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconStar, iconMenu, iconCircle, iconGrid } from "@/lib/appIcons";
import { iconMic, iconNote, iconSearch } from "@/lib/icons";
import { rankMemories } from "@/lib/memories";
import {
  formatClock,
  entryTitle,
  DEFAULT_FILTERS,
  mergeVaultEntries,
  applyFilters,
  groupByMonth,
  emptyStateMessage,
} from "@/lib/memoriesView";
import { cn } from "@/lib/utils";

const se = {
  photo: {
    labelKey: "memories.kind.photo",
    icon: null,
  },
  voice: {
    labelKey: "memories.kind.voice",
    icon: iconMic,
  },
  note: {
    labelKey: "memories.kind.note",
    icon: iconNote,
  },
};
const ie = {
  pending: "memories.processing.pending",
  failed: "memories.processing.failed",
};
function le(entry, locale) {
  const l = new Date(entry.at);
  if (Number.isNaN(l.getTime())) {
    return "";
  }
  return l.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function SComponent({ entry, onOpen }) {
  const { t: t_1, locale } = useI18n();
  const d = se[entry.kind];
  const x = formatClock(entry.durationSeconds);
  const p = (entry.content || entry.summary || "").trim();
  const n = entryTitle(entry);
  const g = p && p !== n;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col items-stretch overflow-hidden rounded-[12px] border border-alma-line bg-white text-start transition-colors hover:bg-alma-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
    >
      {entry.thumbnailUrl && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-alma-soft">
          <img src={entry.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-alma-soft px-2.5 py-1 font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.65)]">
            {d.icon && <img src={d.icon} alt="" className="h-3 w-3 opacity-70" />}
            {t_1(d.labelKey)}
            {x && <span className="text-[rgba(23,50,77,0.5)]">· {x}</span>}
          </span>
          {entry.isCore && (
            <span className="flex items-center gap-1 rounded-full bg-alma-panel px-2.5 py-1 font-body text-[11.5px] tracking-[0.23px] text-alma-ink">
              <img src={iconStar} alt="" className="h-3 w-3" />
              {t_1("memories.filter.core")}
            </span>
          )}
          <span className="flex-1" />
          {entry.processing !== "complete" && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-body text-[11px] tracking-[0.22px]",
                entry.processing === "failed" ? "bg-[#fdf1f0] text-[#b3261e]" : "bg-alma-soft text-alma-muted",
              )}
            >
              {t_1(ie[entry.processing])}
            </span>
          )}
        </div>
        <p className="line-clamp-2 font-body text-[14.5px] font-medium leading-[24px] tracking-[0.14px] text-alma-ink">
          {n}
        </p>
        {g && (
          <p className="line-clamp-2 font-body text-[13px] leading-[22px] tracking-[0.13px] text-alma-muted">{p}</p>
        )}
        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <span className="font-body text-[11.5px] tracking-[0.23px] text-alma-muted">{le(entry, locale)}</span>
          {entry.atIsEstimated && (
            <span
              title="Filed under the day it was captured — the date it happened isn't recorded"
              className="rounded-full bg-alma-soft px-2 py-0.5 font-body text-[10.5px] tracking-[0.21px] text-alma-muted"
            >
              {t_1("memories.dateUnconfirmed")}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
const oe = [
  {
    key: "all",
    labelKey: "memories.filter.all",
  },
  {
    key: "photo",
    labelKey: "memories.filter.photos",
  },
  {
    key: "voice",
    labelKey: "memories.filter.voice",
  },
  {
    key: "note",
    labelKey: "memories.filter.notes",
  },
];
function ne(t) {
  return {
    id: t.id,
    title: entryTitle(t),
    content: t.content,
    tags: t.tags,
    kind: t.kind,
    takenAt: t.at,
    entityNames: t.entityNames,
  };
}
const E =
  "id, title, summary, content, type, tags, timestamp, event_date, event_date_is_estimated, is_core, processing_state, metadata";
async function re(t) {
  const s = await supabase
    .from("memories")
    .select(`${E}, memory_media(duration_seconds)`)
    .eq("user_id", t)
    .is("deleted_at", null)
    .order("timestamp", {
      ascending: false,
    });
  if (!s.error || s.error.code !== "42703") {
    return s;
  }
  return (
    console.warn("memory_media.duration_seconds not migrated — loading without durations"),
    await supabase.from("memories").select(E).eq("user_id", t).is("deleted_at", null).order("timestamp", {
      ascending: false,
    })
  );
}
export default function Memories() {
  const t = useNavigate();
  const { t: t_1 } = useI18n();
  const l = useMobileNav();
  const [f, d] = useSearchParams();
  const [x, setX] = React.useState([]);
  const [n, setN] = React.useState(() => f.get("q") ?? "");
  const [c, setC] = React.useState(DEFAULT_FILTERS);
  const [N, setN_1] = React.useState("timeline");
  const [R, setR] = React.useState(true);
  const k = React.useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      const [i, r, P] = await Promise.all([
        re(user.id),
        supabase.from("gallery_images").select("id, file_url, file_name, created_at").eq("user_id", user.id),
        supabase.from("context_mentions").select("memory_id, context_entities(name, aliases)").eq("user_id", user.id),
      ]);
      const v = {};
      for (const m of P.data ?? []) {
        if (!m.memory_id || !m.context_entities) {
          continue;
        }
        const _ = v[m.memory_id] ?? (v[m.memory_id] = []);
        if (m.context_entities.name) {
          _.push(m.context_entities.name);
        }
        for (const U of m.context_entities.aliases ?? []) {
          _.push(U);
        }
      }
      setX(mergeVaultEntries(i.data ?? [], r.data ?? [], v));
    } catch (error) {
      console.error("Error loading memories:", error);
      toast.error(t_1("memories.err.load"));
    } finally {
      setR(false);
    }
  }, [t_1]);
  React.useEffect(() => {
    k();
  }, [k]);
  const b = React.useMemo(() => applyFilters(x, c), [x, c]);
  const h = React.useMemo(() => {
    const a = n.trim();
    if (!a) {
      return b;
    }
    const i = new Map(b.map((r) => [r.id, r]));
    return rankMemories(b.map(ne), a, 500)
      .map((r) => i.get(r.memory.id))
      .filter((r) => !!r);
  }, [b, n]);
  const q = React.useMemo(() => groupByMonth(h), [h]);
  const w = (a) =>
    t(`/memories/${a.id}`, {
      state: {
        source: a.source,
      },
    });
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileTopBar
          title={t_1("memories.heading")}
          subtitle={t_1("memories.eyebrow")}
          leading={{
            icon: iconMenu,
            label: t_1("nav.menu"),
            onClick: l.open,
          }}
        />
        <div className="hidden shrink-0 flex-col gap-3 px-4 pb-6 pt-[38px] sm:px-[30px] md:flex">
          <p className="font-body text-sm tracking-[0.14px] text-alma-muted">{t_1("memories.eyebrow")}</p>
          <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">
            {t_1("memories.heading")}
          </h1>
        </div>
        <div className="flex flex-col gap-5 px-4 pb-10 sm:px-[30px]">
          <label className="relative block">
            <img
              src={iconSearch}
              alt=""
              className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
            />
            <input
              value={n}
              onChange={(a) => {
                setN(a.target.value);
                const i = new URLSearchParams(f);
                if (a.target.value.trim()) {
                  i.set("q", a.target.value);
                } else {
                  i.delete("q");
                }
                d(i, {
                  replace: true,
                });
              }}
              placeholder={t_1("memories.search")}
              aria-label={t_1("memories.search")}
              className="h-12 w-full rounded-[14px] border border-alma-line bg-white ps-11 pe-4 font-body text-[15px] tracking-[0.15px] text-alma-ink outline-none transition-colors placeholder:text-[rgba(23,50,77,0.4)] focus:border-alma-action"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {oe.map((a) => (
              <CComponent
                key={a.key}
                label={t_1(a.labelKey)}
                active={c.kind === a.key}
                onClick={() =>
                  setC((i) => ({
                    ...i,
                    kind: a.key,
                  }))
                }
              />
            ))}
            <span className="mx-1 h-5 w-px bg-alma-line" />
            <CComponent
              label={t_1("memories.filter.core")}
              active={c.coreOnly}
              onClick={() =>
                setC((a) => ({
                  ...a,
                  coreOnly: !a.coreOnly,
                }))
              }
            />
            <span className="flex-1" />
            <div className="flex items-center gap-1 rounded-[24px] border border-alma-line bg-white p-1">
              {[
                ["timeline", iconCircle],
                ["grid", iconGrid],
              ].map(([a, src]) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setN_1(a)}
                  aria-label={`${a} view`}
                  aria-pressed={N === a}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-[20px] px-3 font-body text-[13px] capitalize tracking-[0.13px] transition-colors",
                    N === a ? "bg-alma-panel text-alma-ink" : "text-alma-muted hover:bg-alma-soft",
                  )}
                >
                  <img src={src} alt="" className="h-3.5 w-3.5" />
                  {t_1(`memories.view.${a}`)}
                </button>
              ))}
            </div>
          </div>
          {R ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((key) => (
                <div key={key} className="h-[150px] animate-pulse rounded-[12px] border border-alma-line bg-white" />
              ))}
            </div>
          ) : h.length === 0 ? (
            <div className="rounded-[12px] border border-alma-line bg-white px-6 py-16 text-center">
              <p className="mx-auto max-w-md font-body text-[15px] leading-[26px] tracking-[0.15px] text-alma-muted">
                {emptyStateMessage(c, n, x.length)}
              </p>
              {(n || c.kind !== "all" || c.coreOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setN("");
                    d(new URLSearchParams(), {
                      replace: true,
                    });
                    setC(DEFAULT_FILTERS);
                  }}
                  className="mt-5 rounded-full border border-alma-line bg-white px-5 py-2.5 font-body text-[13px] tracking-[0.26px] text-alma-ink transition-colors hover:bg-alma-soft"
                >
                  {t_1("action.clear")}
                </button>
              )}
            </div>
          ) : N === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {h.map((a) => (
                <SComponent key={a.id} entry={a} onOpen={() => w(a)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {q.map((a) => (
                <section key={a.key} className="flex flex-col gap-4">
                  <h2 className="font-display text-base font-semibold tracking-[0.16px] text-alma-ink">
                    {a.label}
                    <span className="ms-2 font-body text-[12px] font-normal text-alma-muted">{a.entries.length}</span>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {a.entries.map((i) => (
                      <SComponent key={i.id} entry={i} onOpen={() => w(i)} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function CComponent({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-[24px] border px-4 py-2 font-body text-sm tracking-[0.14px] transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
        active
          ? "border-transparent bg-alma-panel text-alma-ink"
          : "border-alma-line bg-white text-alma-muted hover:bg-alma-soft",
      )}
    >
      {label}
    </button>
  );
}
