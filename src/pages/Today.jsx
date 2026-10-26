import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileTopBar } from "@/components/MobileTopBar";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconMenu, iconMsg } from "@/lib/appIcons";
import { conversationDayLabel } from "@/lib/conversations";
import { activeCheckinSlot, iconClock } from "@/lib/settingsPrefs";

const q = {
  morning: "today.when.morning",
  midday: "today.when.midday",
  evening: "today.when.evening",
};
function _(a, timeZone) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(a);
  } catch {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(a);
  }
}
function B(slotAt) {
  const [t, n] = String(slotAt ?? "")
    .split(":")
    .map(Number);
  if (!Number.isFinite(t) || !Number.isFinite(n)) {
    return "";
  }
  return `${t % 12 === 0 ? 12 : t % 12}:${String(n).padStart(2, "0")} ${t < 12 ? "am" : "pm"}`;
}
function U(lastUserMessageAt, t, timezone) {
  if (!lastUserMessageAt) {
    return false;
  }
  const o = new Date(lastUserMessageAt);
  if (Number.isNaN(o.getTime())) {
    return false;
  }
  return _(o, timezone) === t;
}
function Z(a) {
  const t = _(a.now, a.timezone);
  const when = q[a.slot] ?? "today.when.morning";
  const o = a.sentOnLocalDate === t;
  if (a.phoneLinked) {
    if (a.checkinOn) {
      if (o && U(a.lastUserMessageAt, t, a.timezone)) {
        return {
          state: "done",
          titleKey: "today.state.done.title",
          bodyKey: "today.state.done.body",
          titleVars: {
            when,
          },
          primaryLabelKey: "today.action.addSomethingElse",
          primaryPrompt: null,
        };
      }
      if (o) {
        return {
          state: "waiting",
          titleKey: "today.state.waiting.title",
          bodyKey: "today.state.waiting.body",
          titleVars: {
            when,
          },
          primaryLabelKey: "today.action.answerHere",
          primaryPrompt: null,
        };
      }
      return {
        state: "scheduled",
        titleKey: "today.state.scheduled.title",
        bodyKey: "today.state.scheduled.body",
        titleVars: {
          time: B(a.slotAt),
        },
        primaryLabelKey: "today.action.startNow",
        primaryPrompt: null,
      };
    }
    return {
      state: "paused",
      titleKey: "today.state.paused.title",
      bodyKey: "today.state.paused.body",
      titleVars: {},
      primaryLabelKey: "today.action.writeSomething",
      primaryPrompt: null,
    };
  }
  return {
    state: "not-linked",
    titleKey: "today.state.notLinked.title",
    bodyKey: "today.state.notLinked.body",
    titleVars: {},
    primaryLabelKey: "today.action.startConversation",
    primaryPrompt: null,
  };
}
const H = 6;
const W = {
  morning_at: "08:00",
  midday_at: "13:00",
  evening_at: "20:00",
};
function Y(titleVars, t) {
  const n = {};
  for (const [o, s] of Object.entries(titleVars)) {
    n[o] = s.includes(".") ? t(s) : s;
  }
  return n;
}
export default function Today() {
  const a = useNavigate();
  const { t, locale } = useI18n();
  const o = useMobileNav();
  const [s, setS] = React.useState(null);
  const [m, setM] = React.useState([]);
  const [g, setG] = React.useState("");
  const [f, setF] = React.useState(true);
  const now = React.useMemo(() => new Date(), []);
  const h = React.useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      const [T, D, E] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, phone, timezone, preferences")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("memories")
          .select("id, content, type, timestamp")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .order("timestamp", {
            ascending: false,
          })
          .limit(H),
        supabase
          .from("chat_messages")
          .select("created_at")
          .eq("user_id", user.id)
          .eq("role", "user")
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle(),
      ]);
      const i = T.data;
      const x = i?.preferences?.whatsapp ?? {};
      const N = {
        ...W,
        ...x,
      };
      const slot = activeCheckinSlot(N);
      const O = `last_${slot}_sent`;
      setG(i?.display_name?.trim()?.split(/\s+/)[0] ?? "");
      setM(D.data ?? []);
      setS(
        Z({
          now,
          timezone: i?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          phoneLinked: !!(i != null && i.phone) && x.enabled === true,
          checkinOn: x.checkin_on !== false,
          slot,
          slotAt: N[`${slot}_at`] ?? "08:00",
          sentOnLocalDate: x[O] ?? null,
          lastUserMessageAt: E.data?.created_at ?? null,
        }),
      );
    } catch (error) {
      console.error("Error loading Today:", error);
      toast.error(t("today.err.load"));
    } finally {
      setF(false);
    }
  }, [now, t]);
  React.useEffect(() => {
    h();
  }, [h]);
  const onClick = () => {
    a("/chat", {
      state:
        s != null && s.primaryPrompt
          ? {
              newConversation: true,
              draft: s.primaryPrompt,
            }
          : {
              newConversation: true,
            },
    });
  };
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileTopBar
          title={t("today.heading")}
          leading={{
            icon: iconMenu,
            label: t("nav.menu"),
            onClick: o.open,
          }}
        />
        <div className="flex shrink-0 flex-col gap-3 px-4 sm:px-[30px] pb-6 pt-4 md:pt-[38px]">
          <p className="font-body text-sm tracking-[0.14px] text-alma-muted">
            {now.toLocaleDateString(locale, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">
            {g
              ? t("today.greeting", {
                  name: g,
                })
              : t("today.heading")}
          </h1>
        </div>
        <div className="flex flex-col gap-6 px-4 sm:px-[30px] pb-10">
          {f ? (
            <div className="h-[180px] animate-pulse rounded-[12px] border border-alma-line bg-white" />
          ) : s ? (
            <section className="rounded-[12px] border border-alma-line bg-gradient-to-r from-alma-soft to-white to-[70%] px-6 py-6">
              <div className="flex items-center gap-2">
                <img src={iconClock} alt="" className="h-4 w-4 opacity-60" />
                <span className="font-body text-[11.5px] uppercase tracking-[1px] text-alma-muted">
                  {s.state === "done" ? t("today.checkin.done") : t("today.checkin.label")}
                </span>
              </div>
              <h2 className="mt-4 max-w-3xl font-display text-[26px] font-semibold leading-tight tracking-[0.26px] text-alma-ink">
                {t(s.titleKey, Y(s.titleVars, t))}
              </h2>
              <p className="mt-3 max-w-xl font-body text-[15px] leading-[26px] tracking-[0.15px] text-alma-muted">
                {t(s.bodyKey)}
              </p>
              <button
                type="button"
                onClick={onClick}
                className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-3 ps-5 pe-6 font-body text-[14px] font-medium tracking-[0.28px] text-white shadow-[0px_2px_6px_0px_rgba(40,94,133,0.18)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
              >
                <img src={iconMsg} alt="" className="h-4 w-4 brightness-0 invert" />
                {t(s.primaryLabelKey)}
              </button>
            </section>
          ) : null}
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-semibold tracking-[0.18px] text-alma-ink">{t("today.lately")}</h2>
            {f ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((key) => (
                  <div key={key} className="h-[120px] animate-pulse rounded-[12px] border border-alma-line bg-white" />
                ))}
              </div>
            ) : m.length === 0 ? (
              <div className="rounded-[12px] border border-alma-line bg-white px-6 py-12 text-center">
                <p className="font-body text-[15px] leading-[26px] tracking-[0.15px] text-alma-muted">
                  {t("today.empty")}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {m.map((entry) => (
                  <JComponent key={entry.id} entry={entry} now={now} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
const G = {
  photo: "memories.kind.photo",
  image: "memories.kind.photo",
  voice: "memories.kind.voice",
  audio: "memories.kind.voice",
  text: "memories.kind.note",
};
function JComponent({ entry, now }) {
  const n = useNavigate();
  const { t: t_1 } = useI18n();
  const s = t_1(G[String(entry.type ?? "").toLowerCase()] ?? "memories.kind.note");
  const c = entry.timestamp ? conversationDayLabel(entry.timestamp, now) : "";
  const m = (entry.content ?? "").trim();
  return (
    <button
      type="button"
      onClick={() => n("/memory-vault")}
      className="flex flex-col items-start gap-2.5 rounded-[12px] border border-alma-line bg-white p-5 text-start transition-colors hover:bg-alma-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
    >
      <div className="flex w-full items-center gap-2">
        <span className="rounded-full bg-alma-soft px-2.5 py-1 font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.65)]">
          {s}
        </span>
        <span className="flex-1" />
        {c && <span className="font-body text-[11px] tracking-[0.22px] text-alma-muted">{c}</span>}
      </div>
      <p className="line-clamp-3 font-body text-sm leading-6 tracking-[0.14px] text-alma-ink">{m || "No caption"}</p>
    </button>
  );
}
