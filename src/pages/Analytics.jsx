import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileTopBar } from "@/components/MobileTopBar";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconMenu, iconRefresh } from "@/lib/appIcons";
import {
  monthMarkers,
  voiceTotals,
  activeDays,
  currentStreak,
  weeklyBuckets,
  rhythmLine,
  journeySummary,
  busiestMonth,
  formatDuration,
  missingLengthNote,
} from "@/lib/journeyStats";
import { cn } from "@/lib/utils";

function OComponent({ buckets, highlightLast = 4 }) {
  const id = React.useId();
  const a = Math.max(1, ...buckets.map((s) => s.count));
  const g = monthMarkers(buckets);
  const x = new Map(g.map((s) => [s.index, s.label]));
  return (
    <figure className="m-0 w-full">
      <div className="flex h-[182px] w-full items-end gap-1.5" role="img" aria-describedby={id}>
        {buckets.map((s, c) => {
          const n = c >= buckets.length - highlightLast;
          const l = s.count === 0 ? 5 : Math.max(9, (s.count / a) * 100);
          const h = s.startedAt.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
          });
          return (
            <div
              key={s.offsetWeeks}
              title={`Week of ${h}: ${s.count} ${s.count === 1 ? "memory" : "memories"}`}
              className={cn(
                "min-w-0 flex-1 rounded-[4px] border border-[rgba(213,226,236,0.7)] transition-colors",
                s.count === 0 ? "bg-transparent" : n ? "bg-[#8fb8d6]" : "bg-[#c8e1f2]",
                s.count > 0 && "hover:bg-alma-accent-deep/40",
              )}
              style={{
                height: `${l}%`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-4 flex w-full gap-1.5">
        {buckets.map((s, c) => (
          <span
            key={s.offsetWeeks}
            className="min-w-0 flex-1 font-body text-base tracking-[0.16px] text-[rgba(23,50,77,0.5)]"
          >
            {x.get(c) ?? ""}
          </span>
        ))}
      </div>
      <figcaption id={id} className="sr-only">
        Memories kept per week over the last {buckets.length} weeks:{" "}
        {buckets.map((s) => `week of ${s.startedAt.toLocaleDateString()}, ${s.count}`).join("; ")}.
      </figcaption>
    </figure>
  );
}
const src =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%20clip-path='url(%23clip0_0_589)'%3e%3cpath%20id='Vector'%20d='M7.34467%201.876C7.37323%201.72307%207.45438%201.58494%207.57406%201.48555C7.69375%201.38615%207.84442%201.33174%208%201.33174C8.15558%201.33174%208.30625%201.38615%208.42594%201.48555C8.54562%201.58494%208.62677%201.72307%208.65533%201.876L9.356%205.58133C9.40576%205.84477%209.53378%206.08708%209.72335%206.27665C9.91292%206.46622%2010.1552%206.59424%2010.4187%206.644L14.124%207.34467C14.2769%207.37323%2014.4151%207.45438%2014.5145%207.57406C14.6139%207.69375%2014.6683%207.84442%2014.6683%208C14.6683%208.15558%2014.6139%208.30625%2014.5145%208.42594C14.4151%208.54562%2014.2769%208.62677%2014.124%208.65533L10.4187%209.356C10.1552%209.40576%209.91292%209.53378%209.72335%209.72335C9.53378%209.91292%209.40576%2010.1552%209.356%2010.4187L8.65533%2014.124C8.62677%2014.2769%208.54562%2014.4151%208.42594%2014.5145C8.30625%2014.6139%208.15558%2014.6683%208%2014.6683C7.84442%2014.6683%207.69375%2014.6139%207.57406%2014.5145C7.45438%2014.4151%207.37323%2014.2769%207.34467%2014.124L6.644%2010.4187C6.59424%2010.1552%206.46622%209.91292%206.27665%209.72335C6.08708%209.53378%205.84477%209.40576%205.58133%209.356L1.876%208.65533C1.72307%208.62677%201.58494%208.54562%201.48555%208.42594C1.38615%208.30625%201.33174%208.15558%201.33174%208C1.33174%207.84442%201.38615%207.69375%201.48555%207.57406C1.58494%207.45438%201.72307%207.37323%201.876%207.34467L5.58133%206.644C5.84477%206.59424%206.08708%206.46622%206.27665%206.27665C6.46622%206.08708%206.59424%205.84477%206.644%205.58133L7.34467%201.876Z'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M13.3333%201.33333V4'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M14.6667%202.66667H12'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M2.66667%2014.6667C3.40305%2014.6667%204%2014.0697%204%2013.3333C4%2012.597%203.40305%2012%202.66667%2012C1.93029%2012%201.33333%2012.597%201.33333%2013.3333C1.33333%2014.0697%201.93029%2014.6667%202.66667%2014.6667Z'%20stroke='%2317324d'%20stroke-width='0.666667'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_589'%3e%3crect%20width='16'%20height='16'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const _ = 12;
const Y = 5000;
const G = {
  memories: 0,
  conversations: 0,
  voiceNotes: 0,
  voice: {
    seconds: 0,
    recorded: 0,
    total: 0,
  },
  peopleNamed: 0,
  revisited: 0,
  days: 0,
  streak: 0,
  buckets: [],
  pattern: null,
  reflection: "",
};
function U1Component({ value, label, note }) {
  return (
    <div className="flex min-w-[200px] flex-1 flex-col gap-2.5 rounded-[12px] border border-[#d5e2ec] px-6 py-5">
      <p className="font-display text-5xl font-medium tracking-[0.48px] text-alma-ink">{value}</p>
      <p className="font-body text-base uppercase tracking-[0.32px] text-alma-ink">{label}</p>
      {note && <p className="font-body text-[11.5px] leading-4 tracking-[0.23px] text-alma-muted">{note}</p>}
    </div>
  );
}
async function Q(t) {
  const i = (a) =>
    supabase
      .from("memories")
      .select(a)
      .eq("user_id", t)
      .order("timestamp", {
        ascending: false,
      })
      .limit(Y)
      .returns();
  const o = await i("timestamp, created_at, type, memory_media(duration_seconds)");
  if (!o.error || o.error.code !== "42703") {
    return o;
  }
  return (
    console.warn("memory_media.duration_seconds not migrated — analytics without voice duration"),
    await i("timestamp, created_at, type")
  );
}
export default function Analytics() {
  const { t } = useI18n();
  const i = useMobileNav();
  const o = useNavigate();
  const [a, setA] = React.useState(G);
  const [x, setX] = React.useState(true);
  const c = React.useCallback(async () => {
    setX(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t("analytics.err.login"));
        setX(false);
        return;
      }
      const [l, h, L, M] = await Promise.all([
        Q(user.id),
        supabase
          .from("conversations")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),
        supabase
          .from("context_entities")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id)
          .eq("kind", "person")
          .is("merged_into", null),
        supabase.from("context_surfaced").select("subject_key").eq("user_id", user.id),
      ]);
      if (l.error) {
        throw l.error;
      }
      const b = l.data ?? [];
      const d = b.map((r) => r.timestamp ?? r.created_at);
      const v = new Date();
      const memories = b.length;
      const w = b.filter((r) => r.type === "voice" || r.type === "audio");
      const voiceNotes = w.length;
      const voice = voiceTotals(
        w.flatMap((r) =>
          (r.memory_media ?? []).map((f) => {
            if (f?.duration_seconds == null) {
              return null;
            }
            return Number(f.duration_seconds);
          }),
        ),
        voiceNotes,
      );
      const revisited = new Set((M.data ?? []).map((r) => r.subject_key)).size;
      const days = activeDays(d);
      setA({
        memories,
        conversations: h.count ?? 0,
        voiceNotes,
        voice,
        peopleNamed: L.count ?? 0,
        revisited,
        days,
        streak: currentStreak(d, v),
        buckets: weeklyBuckets(d, v, _),
        pattern: rhythmLine(d),
        reflection: journeySummary({
          memories,
          days,
          revisited,
          voiceNotes,
          busiest: busiestMonth(d),
        }),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error(t("analytics.err.load"));
    } finally {
      setX(false);
    }
  }, [t]);
  React.useEffect(() => {
    c();
  }, [c]);
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileTopBar
          title={t("analytics.heading")}
          subtitle={t("analytics.eyebrow")}
          leading={{
            icon: iconMenu,
            label: t("nav.menu"),
            onClick: i.open,
          }}
        />
        <div className="hidden shrink-0 flex-wrap items-start justify-between gap-4 px-4 sm:px-[30px] pb-6 pt-[38px] md:flex">
          <div className="flex flex-col gap-3">
            <p className="font-body text-sm tracking-[0.14px] text-[rgba(23,50,77,0.6)] opacity-80">
              {t("analytics.eyebrow")}
            </p>
            <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink/80">
              {t("analytics.heading")}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void c()}
            disabled={x}
            className="flex items-center gap-2.5 rounded-[24px] border border-dashed border-[rgba(23,50,77,0.6)] px-6 py-2.5 font-body text-base tracking-[0.16px] text-[rgba(23,50,77,0.7)] transition-colors hover:bg-alma-panel/40 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
          >
            <img src={iconRefresh} alt="" className="h-4 w-4" />
            {x ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="flex flex-col gap-6 px-4 sm:px-[30px] pb-10">
          <section className="rounded-[12px] border border-[#d5e2ec] bg-gradient-to-r from-[#eaf3fa] to-white to-[70%] px-6 py-6">
            <h2 className="max-w-4xl font-display text-[32px] font-semibold leading-tight tracking-[0.32px] text-alma-ink/80">
              {t("analytics.youKept")}
              <span className="text-[#2f6e99]">{a.memories.toLocaleString()}</span>{" "}
              {a.memories === 1 ? "memory" : "memories"} across{" "}
              <span className="text-[#2f6e99]">{a.days.toLocaleString()}</span> {a.days === 1 ? "day" : "days"}
              {a.revisited > 0 && <> and revisited {a.revisited.toLocaleString()} of them</>}
            </h2>
            {a.pattern && <p className="mt-5 font-body text-base tracking-[0.16px] text-alma-ink">{a.pattern}</p>}
          </section>
          <div className="flex flex-wrap gap-6">
            <U1Component value={a.memories.toLocaleString()} label="memories kept" />
            <U1Component value={a.conversations.toLocaleString()} label="conversations" />
            <U1Component
              value={formatDuration(a.voice.seconds)}
              label="of voice saved"
              note={missingLengthNote(a.voice)}
            />
            <U1Component value={a.peopleNamed.toLocaleString()} label="people named" />
          </div>
          <section className="rounded-[12px] border border-[#d5e2ec] bg-white p-5">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">Last {_} weeks</h2>
              {a.streak > 0 && (
                <span className="flex h-[41px] items-center justify-center rounded-[24px] bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-6 font-body text-base font-medium tracking-[0.16px] text-white opacity-90 shadow-[0px_2px_6px_0px_rgba(40,94,133,0.18)]">
                  {a.streak} {a.streak === 1 ? "day" : "days"} streak
                </span>
              )}
            </div>
            {a.buckets.length > 0 && <OComponent buckets={a.buckets} />}
          </section>
          <section
            className="rounded-[12px] border border-[#d5e2ec] p-5"
            style={{
              backgroundImage: "linear-gradient(97.97deg, rgb(255,255,255) 0.83%, rgb(222,255,233) 69.06%)",
            }}
          >
            <div className="flex items-center gap-3">
              <p className="font-body text-base tracking-[0.16px] text-[rgba(23,50,77,0.5)]">
                {t("analytics.reflection")}
              </p>
              <span className="h-1 w-1 shrink-0 rounded-full bg-[rgba(23,50,77,0.5)]" />
              <p className="font-body text-base tracking-[0.16px] text-[rgba(23,50,77,0.5)]">{t("analytics.today")}</p>
            </div>
            <p className="mt-3 max-w-5xl font-display text-2xl tracking-[0.48px] text-alma-ink">{a.reflection}</p>
            <button
              type="button"
              onClick={() =>
                o("/chat", {
                  state: {
                    newConversation: true,
                    draft: "Look back over what I've kept so far and tell me what you notice.",
                  },
                })
              }
              className="mt-6 flex h-[45px] items-center justify-center gap-2.5 rounded-[24px] bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-6 font-body text-base font-semibold tracking-[0.32px] text-white opacity-80 shadow-[0px_2px_6px_0px_rgba(40,94,133,0.18)] transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
            >
              <img src={src} alt="" className="brightness-0 invert h-4 w-4" />
              {t("analytics.askAlma")}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
