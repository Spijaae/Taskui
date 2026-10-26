import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileTopBar } from "@/components/MobileTopBar";
import { GhostPill, PrimaryPill, DangerPill, iconTrash } from "@/components/settings/SettingsParts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconChevronLeft, iconStar, iconStarOutline, iconBack } from "@/lib/appIcons";
import { normalizeKind, normalizeProcessing } from "@/lib/memoriesView";
import { cn } from "@/lib/utils";

const H = ["event", "reflection", "idea", "intention", "dream"];
const F = 120;
const q = 2000;
const he = 40;
const ye = 20;
function E(tags) {
  const l = new Set();
  const t = [];
  for (const h of tags ?? []) {
    const n = String(h ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, he);
    if (!n) {
      continue;
    }
    const p = n.toLowerCase();
    if (!l.has(p) && (l.add(p), t.push(n), t.length >= ye)) {
      break;
    }
  }
  return t;
}
function be(s) {
  if (s.title.trim().length > F) {
    return `Title is too long — keep it under ${F} characters.`;
  }
  if (s.summary.trim().length > q) {
    return `Summary is too long — keep it under ${q} characters.`;
  }
  if (s.eventDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.eventDate)) {
      return "That date isn't a real date.";
    }
    const l = new Date(`${s.eventDate}T12:00:00`);
    if (Number.isNaN(l.getTime())) {
      return "That date isn't a real date.";
    }
    if (l.getTime() > Date.now() + 86400000) {
      return "That date is in the future.";
    }
  }
  if (s.entryType && !H.includes(s.entryType)) {
    return "Pick one of the listed kinds.";
  }
  return null;
}
function ve(s, l) {
  return (
    s.title.trim() !== l.title.trim() ||
    s.summary.trim() !== l.summary.trim() ||
    s.eventDate !== l.eventDate ||
    s.eventDateIsEstimated !== l.eventDateIsEstimated ||
    s.entryType !== l.entryType ||
    s.isCore !== l.isCore ||
    E(s.tags).join("\0") !== E(l.tags).join("\0")
  );
}
function je(s) {
  const event_date = s.eventDate || null;
  return {
    title: s.title.trim() || null,
    summary: s.summary.trim() || null,
    event_date,
    event_date_is_estimated: event_date ? s.eventDateIsEstimated : false,
    entry_type: s.entryType || null,
    is_core: s.isCore,
    tags: E(s.tags),
  };
}
const body =
  "This removes the entry from your vault, and Alma will stop using it to answer questions. The original message it came from goes with it. This cannot be undone.";
const G = {
  title: "",
  summary: "",
  eventDate: "",
  eventDateIsEstimated: false,
  tags: [],
  entryType: "",
  isCore: false,
};
export default function MemoryDetail() {
  const { id } = useParams();
  const l = useNavigate();
  const { t, locale } = useI18n();
  const [n, setN] = React.useState(null);
  const [f, setF] = React.useState(G);
  const [r, setR] = React.useState(G);
  const [u, setU] = React.useState(false);
  const [w, setW] = React.useState(false);
  const [z, setZ] = React.useState(true);
  const [K, setK] = React.useState(false);
  const [U, setU_1] = React.useState(false);
  const [Q, setQ] = React.useState(false);
  const [V, setV] = React.useState("");
  const N = React.useCallback(async () => {
    if (id) {
      try {
        const { data, error } = await supabase
          .from("memories")
          .select(
            "id, title, summary, content, type, tags, timestamp, event_date, event_date_is_estimated, entry_type, is_core, processing_state, metadata",
          )
          .eq("id", id)
          .is("deleted_at", null)
          .maybeSingle();
        if (error || !data) {
          setK(true);
          return;
        }
        const o = data;
        const attachments = (o.metadata?.attachments ?? []).filter((T) => typeof T?.url === "string");
        const x = {
          id: String(o.id),
          content: String(o.content ?? ""),
          title: o.title ?? null,
          summary: o.summary ?? null,
          kind: normalizeKind(o.type),
          tags: o.tags ?? [],
          timestamp: o.timestamp ?? null,
          eventDate: o.event_date ?? null,
          eventDateIsEstimated: o.event_date_is_estimated === true,
          entryType: o.entry_type ?? null,
          isCore: o.is_core === true,
          processing: normalizeProcessing(o.processing_state),
          attachments,
        };
        const $ = {
          title: x.title ?? "",
          summary: x.summary ?? "",
          eventDate: x.eventDate ?? "",
          eventDateIsEstimated: x.eventDateIsEstimated,
          tags: x.tags,
          entryType: x.entryType ?? "",
          isCore: x.isCore,
        };
        setN(x);
        setF($);
        setR($);
      } catch (error) {
        console.error("Error loading memory:", error);
        setK(true);
      } finally {
        setZ(false);
      }
    }
  }, [id]);
  React.useEffect(() => {
    N();
  }, [N]);
  const D = React.useMemo(() => ve(f, r), [f, r]);
  const W = async () => {
    const a = be(r);
    if (a) {
      toast.error(a);
      return;
    }
    setW(true);
    try {
      const i = je(r);
      const { error } = await supabase.from("memories").update(i).eq("id", n.id);
      if (error) {
        throw error;
      }
      setF(r);
      setU(false);
      toast.success(t("detail.ok.saved"));
      await N();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(t("detail.err.save"));
    } finally {
      setW(false);
    }
  };
  const onConfirm = async () => {
    try {
      const { error } = await supabase
        .from("memories")
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq("id", n.id);
      if (error) {
        throw error;
      }
      toast.success(t("detail.ok.deleted"));
      l("/memories", {
        replace: true,
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(t("detail.err.delete"));
    }
  };
  const ee = async () => {
    const a = !r.isCore;
    setR((m) => ({
      ...m,
      isCore: a,
    }));
    const { error } = await supabase
      .from("memories")
      .update({
        is_core: a,
      })
      .eq("id", n.id);
    if (error) {
      setR((m) => ({
        ...m,
        isCore: !a,
      }));
      toast.error(t("detail.err.change"));
      return;
    }
    setF((m) => ({
      ...m,
      isCore: a,
    }));
  };
  const te = () => {
    if (u && D) {
      setQ(true);
      return;
    }
    l("/memories");
  };
  if (z) {
    return (
      <CComponent>
        <div className="mx-auto h-[420px] w-full max-w-3xl animate-pulse rounded-[12px] border border-alma-line bg-white" />
      </CComponent>
    );
  }
  if (K || !n) {
    return (
      <CComponent>
        <div className="mx-auto w-full max-w-lg rounded-[12px] border border-alma-line bg-white px-6 py-14 text-center">
          <h1 className="font-display text-lg font-semibold tracking-[0.18px] text-alma-ink">
            {t("detail.unavailable")}
          </h1>
          <p className="mt-3 font-body text-[14px] leading-6 tracking-[0.14px] text-alma-muted">
            {t("detail.unavailableBody")}
          </p>
          <button
            type="button"
            onClick={() => l("/memories")}
            className="mt-6 rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-5 py-2.5 font-body text-[13px] font-medium tracking-[0.26px] text-white"
          >
            {t("detail.backToMemories")}
          </button>
        </div>
      </CComponent>
    );
  }
  const L = n.eventDate ? new Date(`${n.eventDate}T12:00:00`) : n.timestamp ? new Date(n.timestamp) : null;
  return (
    <CComponent>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={te}
            className="flex items-center gap-2 rounded-full border border-alma-line bg-white px-4 py-2 font-body text-[13px] tracking-[0.26px] text-alma-ink transition-colors hover:bg-alma-soft"
          >
            <img src={iconChevronLeft} alt="" className="rtl:-scale-x-100 h-3.5 w-3.5" />
            {t("action.back")}
          </button>
          <span className="flex-1" />
          <button
            type="button"
            onClick={ee}
            aria-pressed={r.isCore}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 font-body text-[13px] tracking-[0.26px] transition-colors",
              r.isCore
                ? "border-transparent bg-alma-panel text-alma-ink"
                : "border-alma-line bg-white text-alma-muted hover:bg-alma-soft",
            )}
          >
            <img src={r.isCore ? iconStar : iconStarOutline} alt="" className="h-3.5 w-3.5" />
            {r.isCore ? t("detail.isCore") : t("detail.markCore")}
          </button>
          {u ? (
            <>
              <GhostPill
                onClick={() => {
                  if (D) {
                    return setQ(true);
                  }
                  return setU(false);
                }}
                disabled={w}
              >
                {t("action.cancel")}
              </GhostPill>
              <PrimaryPill onClick={W} disabled={w || !D}>
                {t(w ? "action.saving" : "action.save")}
              </PrimaryPill>
            </>
          ) : (
            <GhostPill onClick={() => setU(true)}>{t("action.edit")}</GhostPill>
          )}
        </div>
        <article className="flex flex-col gap-5 rounded-[12px] border border-alma-line bg-white p-6">
          {n.processing !== "complete" && (
            <p
              className={cn(
                "rounded-[10px] px-4 py-3 font-body text-[13px] leading-5 tracking-[0.13px]",
                n.processing === "failed" ? "bg-[#fdf1f0] text-[#b3261e]" : "bg-alma-soft text-alma-muted",
              )}
            >
              {n.processing === "failed" ? t("detail.processing.failed") : t("detail.processing.pending")}
            </p>
          )}
          {n.attachments.map((a) => (
            <img
              key={a.url}
              src={a.url}
              alt=""
              className="w-full rounded-[10px] border border-alma-line object-cover"
            />
          ))}
          {u ? (
            <K1Component label={t("detail.titlePlaceholder")}>
              <input
                value={r.title}
                onChange={(a) =>
                  setR((i) => ({
                    ...i,
                    title: a.target.value,
                  }))
                }
                placeholder={t("detail.titlePlaceholder")}
                className="h-11 w-full rounded-[10px] border border-alma-line bg-alma-field px-3.5 font-body text-[15px] text-alma-ink outline-none focus:border-alma-action"
              />
            </K1Component>
          ) : (
            <h1 className="font-display text-[26px] font-semibold leading-tight tracking-[0.26px] text-alma-ink">
              {n.title || t("common.untitled")}
            </h1>
          )}
          <section className="rounded-[10px] border border-alma-line bg-alma-soft p-4">
            <p className="font-body text-[10px] font-medium uppercase tracking-[1px] text-alma-muted">
              {t("detail.whatYouSent")} · {n.kind === "voice" ? t("detail.transcript") : t("detail.original")}
            </p>
            <p className="mt-2 whitespace-pre-wrap font-body text-[14.5px] leading-[25px] tracking-[0.14px] text-alma-ink">
              {n.content || t("detail.noText")}
            </p>
          </section>
          <section>
            <p className="font-body text-[10px] font-medium uppercase tracking-[1px] text-alma-muted">
              {t("detail.summary")}
            </p>
            {u ? (
              <textarea
                value={r.summary}
                onChange={(a) =>
                  setR((i) => ({
                    ...i,
                    summary: a.target.value,
                  }))
                }
                rows={4}
                placeholder={t("detail.summaryPlaceholder")}
                className="mt-2 w-full rounded-[10px] border border-alma-line bg-alma-field p-3.5 font-body text-[14.5px] leading-[25px] text-alma-ink outline-none focus:border-alma-action"
              />
            ) : (
              <p className="mt-2 whitespace-pre-wrap font-body text-[14.5px] leading-[25px] tracking-[0.14px] text-alma-muted">
                {n.summary || t("detail.noSummary")}
              </p>
            )}
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            <K1Component label={t("detail.when")}>
              {u ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="date"
                    dir="ltr"
                    value={r.eventDate}
                    onChange={(a) =>
                      setR((i) => ({
                        ...i,
                        eventDate: a.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-[10px] border border-alma-line bg-alma-field px-3.5 font-body text-[14px] text-alma-ink outline-none focus:border-alma-action"
                  />
                  <label className="flex items-center gap-2 font-body text-[12.5px] text-alma-muted">
                    <input
                      type="checkbox"
                      checked={r.eventDateIsEstimated}
                      onChange={(a) =>
                        setR((i) => ({
                          ...i,
                          eventDateIsEstimated: a.target.checked,
                        }))
                      }
                      disabled={!r.eventDate}
                      className="size-3.5 accent-alma-action"
                    />
                    {t("detail.unsureDate")}
                  </label>
                </div>
              ) : (
                <p className="font-body text-[14px] text-alma-ink">
                  {L
                    ? L.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : t("detail.notRecorded")}
                  {(!n.eventDate || n.eventDateIsEstimated) && (
                    <span className="ms-2 rounded-full bg-alma-soft px-2 py-0.5 font-body text-[10.5px] text-alma-muted">
                      {n.eventDate ? t("detail.approximate") : t("detail.capturedDate")}
                    </span>
                  )}
                </p>
              )}
            </K1Component>
            <K1Component label={t("detail.kind")}>
              {u ? (
                <select
                  value={r.entryType}
                  onChange={(a) =>
                    setR((i) => ({
                      ...i,
                      entryType: a.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-[10px] border border-alma-line bg-alma-field px-3 font-body text-[14px] text-alma-ink outline-none focus:border-alma-action"
                >
                  <option value="">{t("detail.notSaid")}</option>
                  {H.map((a) => (
                    <option key={a} value={a}>
                      {t(`entryType.${a}`)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="font-body text-[14px] text-alma-ink">
                  {n.entryType ? t(`entryType.${n.entryType}`) : t("detail.notSaid")}
                </p>
              )}
            </K1Component>
          </div>
          <K1Component label={t("detail.tags")}>
            {u ? (
              <input
                value={V || r.tags.join(", ")}
                onChange={(a) => {
                  setV(a.target.value);
                  setR((i) => ({
                    ...i,
                    tags: a.target.value.split(","),
                  }));
                }}
                placeholder={t("detail.tagsPlaceholder")}
                className="h-11 w-full rounded-[10px] border border-alma-line bg-alma-field px-3.5 font-body text-[14px] text-alma-ink outline-none focus:border-alma-action"
              />
            ) : n.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {n.tags.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-alma-soft px-3 py-1 font-body text-[12px] text-[rgba(23,50,77,0.7)]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-body text-[13px] text-alma-muted">{t("detail.noTags")}</p>
            )}
          </K1Component>
        </article>
        <div className="flex justify-end">
          <DangerPill onClick={() => setU_1(true)}>
            <img src={iconTrash} alt="" className="h-[15px] w-[15px]" />
            {t("detail.deleteTitle")}
          </DangerPill>
        </div>
      </div>
      <RComponent
        open={U}
        onOpenChange={setU_1}
        title={t("detail.deleteTitle")}
        body={body}
        confirmLabel={t("action.delete")}
        danger
        onConfirm={onConfirm}
      />
      <RComponent
        open={Q}
        onOpenChange={setQ}
        title={t("detail.discardTitle")}
        body={t("detail.discardBody")}
        confirmLabel={t("detail.discard")}
        danger
        onConfirm={() => {
          setR(f);
          setV("");
          setU(false);
          setQ(false);
        }}
      />
    </CComponent>
  );
}
function CComponent({ children }) {
  const { t: t_1 } = useI18n();
  const t = useNavigate();
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileTopBar
          title={t_1("memories.heading")}
          leading={{
            icon: iconBack,
            label: t_1("action.back"),
            onClick: () => t(-1),
          }}
        />
        <div className="flex flex-1 flex-col px-4 pb-8 pt-2 sm:px-[30px] sm:pt-8">{children}</div>
      </div>
    </div>
  );
}
function K1Component({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-body text-[10px] font-medium uppercase tracking-[1px] text-alma-muted">{label}</p>
      {children}
    </div>
  );
}
function RComponent({ open, onOpenChange, title, body, confirmLabel, danger, onConfirm }) {
  const { t: t_1 } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] border-alma-line bg-white">
        <DialogHeader>
          <DialogTitle
            className={cn(
              "font-display text-lg font-semibold tracking-[0.18px]",
              danger ? "text-[#b3261e]" : "text-alma-ink",
            )}
          >
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="font-body text-[13.5px] leading-6 tracking-[0.14px] text-alma-ink">{body}</p>
        <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5">
          <GhostPill onClick={() => onOpenChange(false)}>{t_1("detail.keepIt")}</GhostPill>
          {danger ? (
            <DangerPill onClick={onConfirm}>{confirmLabel}</DangerPill>
          ) : (
            <PrimaryPill onClick={onConfirm}>{confirmLabel}</PrimaryPill>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
