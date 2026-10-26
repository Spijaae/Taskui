import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast as toastImported } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileSegmented } from "@/components/MobileSegmented";
import { MobileTopBar } from "@/components/MobileTopBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconMenu } from "@/lib/appIcons";
import { springSnappy, fadeQuick } from "@/lib/motion";
import { cn } from "@/lib/utils";

const Re = () => {
  const t = new Date();
  const a = (i) => String(i).padStart(2, "0");
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
};
function YeComponent({ open, onOpenChange, onCreated }) {
  const { t: t_1 } = useI18n();
  const [l, setL] = React.useState("");
  const [g, setG] = React.useState(Re());
  const [s, setS] = React.useState("09:00");
  const [m, setM] = React.useState(60);
  const [I, setI] = React.useState("");
  const [A, setA] = React.useState("");
  const [F, setF] = React.useState(true);
  const [C, setC] = React.useState(false);
  const onClick = async () => {
    setC(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-calendar-event", {
        body: {
          title: l,
          date: g,
          startTime: s,
          durationMinutes: Number(m),
          location: I,
          notes: A,
          remindOnWhatsapp: F,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      if (error) {
        let O = "Couldn't save the event.";
        const S = error.context;
        if (S && typeof S.json === "function") {
          try {
            const _ = await S.json();
            if (_ != null && _.error) {
              O = String(_.error);
            }
          } catch {}
        }
        toastImported.error(O);
        return;
      }
      toastImported.success(String(data?.message ?? "Event saved."));
      setL("");
      setA("");
      setI("");
      onCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Create event failed:", error);
      toastImported.error("Couldn't save the event.");
    } finally {
      setC(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t_1("event.add")}</DialogTitle>
          <DialogDescription>{t_1("event.savedHint")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="ev-title">{t_1("event.title")}</Label>
            <Input
              id="ev-title"
              value={l}
              onChange={(p) => setL(p.target.value)}
              placeholder={t_1("event.titlePlaceholder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ev-date">{t_1("event.date")}</Label>
              <Input id="ev-date" type="date" dir="ltr" value={g} onChange={(p) => setG(p.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ev-time">{t_1("event.start")}</Label>
              <Input id="ev-time" type="time" value={s} onChange={(p) => setS(p.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="ev-dur">{t_1("event.length")}</Label>
            <Input
              id="ev-dur"
              type="number"
              min={5}
              step={5}
              value={m}
              onChange={(p) => setM(Number(p.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ev-loc">{t_1("event.location")}</Label>
            <Input id="ev-loc" value={I} onChange={(p) => setI(p.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ev-notes">{t_1("event.notes")}</Label>
            <Textarea id="ev-notes" rows={2} value={A} onChange={(p) => setA(p.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">{t_1("event.remindWhatsApp")}</p>
              <p className="text-xs text-muted-foreground">{t_1("event.remindHint")}</p>
            </div>
            <Switch checked={F} onCheckedChange={setF} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={C}>
            {t_1("action.cancel")}
          </Button>
          <Button onClick={onClick} disabled={C}>
            {C && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}Save event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function J(t) {
  if (!t) {
    return null;
  }
  const a = Date.parse(t);
  if (Number.isNaN(a)) {
    return null;
  }
  return new Date(a).toISOString();
}
function Ve(t, a) {
  let d;
  const i = new Set((a ?? []).map((s) => s.google_event_id).filter((s) => !!s));
  const n = [];
  for (const s of t ?? []) {
    if (i.has(s.id)) {
      continue;
    }
    const c = J(s.start?.dateTime) ?? J((d = s.start) != null && d.date ? `${s.start.date}T00:00:00Z` : null);
    if (c) {
      n.push({
        id: `google:${s.id}`,
        title: s.summary?.trim() || "(no title)",
        startIso: c,
        location: s.location,
        description: s.description,
        source: "google",
      });
    }
  }
  for (const s of a ?? []) {
    const c = J(s.reminder_time);
    if (c) {
      n.push({
        id: `alma:${s.id}`,
        title: s.event_name?.trim() || "(no title)",
        startIso: c,
        description: s.event_description ?? undefined,
        source: "alma",
      });
    }
  }
  return n.sort((s, c) => s.startIso.localeCompare(c.startIso));
}
const iconLeft =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/left'%3e%3cpath%20id='Vector'%20d='M10.625%2012.75L6.375%208.5L10.625%204.25'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconRight =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/right'%3e%3cpath%20id='Vector'%20d='M6.375%2012.75L10.625%208.5L6.375%204.25'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconPlus =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/plus'%3e%3cpath%20id='Vector'%20d='M3.33333%208H12.6667M8%203.33333V12.6667'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconCal =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='26'%20height='26'%20viewBox='0%200%2026%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/cal'%3e%3cpath%20id='Vector'%20d='M19.5%204.33333H6.5C4.70507%204.33333%203.25%205.78841%203.25%207.58333V20.5833C3.25%2022.3783%204.70507%2023.8333%206.5%2023.8333H19.5C21.2949%2023.8333%2022.75%2022.3783%2022.75%2020.5833V7.58333C22.75%205.78841%2021.2949%204.33333%2019.5%204.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M17.3333%202.16667V6.5M8.66667%202.16667V6.5M3.25%2010.8333H22.75'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconLink =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/link'%3e%3cpath%20id='Vector'%20d='M6.66667%208.66667C7.28976%209.27742%208.12749%209.61952%209%209.61952C9.87251%209.61952%2010.7102%209.27742%2011.3333%208.66667L13.3333%206.66667C13.8148%206.02476%2014.0485%205.23074%2013.9916%204.43037C13.9347%203.63%2013.5911%202.87702%2013.0237%202.30964C12.4563%201.74227%2011.7033%201.3986%2010.903%201.34172C10.1026%201.28484%209.30857%201.51857%208.66667%202L8%202.66667'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M9.33333%207.33333C8.71024%206.72258%207.87251%206.38048%207%206.38048C6.12749%206.38048%205.28976%206.72258%204.66667%207.33333L2.66667%209.33333C2.18524%209.97524%201.95151%2010.7693%202.00839%2011.5696C2.06527%2012.37%202.40894%2013.123%202.97631%2013.6904C3.54368%2014.2577%204.29667%2014.6014%205.09704%2014.6583C5.8974%2014.7152%206.69143%2014.4814%207.33333%2014L8%2013.3333'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconShield =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='13'%20height='13'%20viewBox='0%200%2013%2013'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/shield'%3e%3cpath%20id='Vector'%20d='M6.5%2011.9167C6.5%2011.9167%2010.8333%209.75%2010.8333%206.5V2.70833L6.5%201.08333L2.16667%202.70833V6.5C2.16667%209.75%206.5%2011.9167%206.5%2011.9167Z'%20stroke='%2317324d'%20stroke-opacity='0.4'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const oe = [
  {
    key: "month",
    label: "Month",
  },
  {
    key: "week",
    label: "Week",
  },
  {
    key: "day",
    label: "Day",
  },
];
const className =
  "flex size-[38px] shrink-0 items-center justify-center rounded-[12px] border border-[rgba(23,50,77,0.11)] bg-white/90 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring";
function UeComponent({ title, view, onViewChange, onPrev, onNext, onToday, onNewEvent }) {
  const { t: t_1 } = useI18n();
  const s = useMobileNav();
  return (
    <>
      <MobileTopBar
        title={title}
        subtitle={t_1("calendar.heading")}
        leading={{
          icon: iconMenu,
          label: t_1("nav.menu"),
          onClick: s.open,
        }}
        actions={[
          {
            icon: iconPlus,
            label: t_1("calendar.newEvent"),
            onClick: onNewEvent,
          },
        ]}
      />
      <div className="px-4 pb-3 md:hidden">
        <MobileSegmented
          segments={oe.map((c) => ({
            value: c.key,
            label: c.label,
          }))}
          value={view}
          onChange={onViewChange}
          aria-label={t_1("calendar.viewSwitcher")}
        />
      </div>
      <div className="hidden flex-wrap items-center justify-between gap-4 px-4 pb-6 pt-8 sm:px-6 md:flex lg:px-[30px] lg:pt-[38px]">
        <div className="flex flex-col gap-3">
          <p className="font-body text-sm tracking-[0.14px] text-[rgba(23,50,77,0.6)]">{t_1("calendar.heading")}</p>
          <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">{title}</h1>
        </div>
        <div
          role="tablist"
          aria-label={t_1("calendar.viewSwitcher")}
          className="flex items-center gap-1 rounded-[24px] border border-[#d5e2ec] p-[3px]"
        >
          {oe.map((c) => {
            const m = view === c.key;
            return (
              <button
                key={c.key}
                role="tab"
                aria-selected={m}
                onClick={() => onViewChange(c.key)}
                className="relative rounded-[24px] px-[18px] py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
              >
                {m && (
                  <motion.span
                    layoutId="calendar-view-pill"
                    transition={springSnappy}
                    className="absolute inset-0 rounded-[24px] bg-alma-panel"
                  />
                )}
                <span
                  className={cn(
                    "relative font-body text-[15px] tracking-[0.3px]",
                    m ? "text-alma-ink" : "text-[rgba(23,50,77,0.7)]",
                  )}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPrev} aria-label={t_1("calendar.previous")} className={className}>
            <img src={iconLeft} alt="" className="rtl:-scale-x-100 h-[17px] w-[17px]" />
          </button>
          <button type="button" onClick={onNext} aria-label={t_1("calendar.next")} className={className}>
            <img src={iconRight} alt="" className="rtl:-scale-x-100 h-[17px] w-[17px]" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="flex items-center rounded-[12px] border border-[rgba(23,50,77,0.11)] bg-white/90 px-4 py-2.5 font-body text-[13px] font-medium tracking-[0.26px] text-[rgba(23,50,77,0.85)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
          >
            {t_1("calendar.today")}
          </button>
          <button
            type="button"
            onClick={onNewEvent}
            className="flex items-center gap-[7px] rounded-[12px] bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-2.5 ps-3.5 pe-4 font-body text-[13.5px] font-medium tracking-[0.27px] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
          >
            <img src={iconPlus} alt="" className="brightness-0 invert h-4 w-4" />
            {t_1("calendar.newEvent")}
          </button>
        </div>
      </div>
    </>
  );
}
function GeComponent({ onConnect, onDismiss, connecting }) {
  const { t: t_1 } = useI18n();
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 16,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.94,
        y: 8,
      }}
      transition={springSnappy}
      role="dialog"
      aria-label={t_1("calendar.connectGoogle")}
      className="flex w-[min(520px,calc(100%-2rem))] flex-col items-center gap-4 rounded-[24px] border border-[rgba(23,50,77,0.1)] bg-white/[0.98] px-9 pb-7 pt-[34px] text-center shadow-[0px_18px_48px_0px_rgba(23,50,77,0.14)]"
    >
      <span
        className="flex size-[58px] items-center justify-center rounded-[18px] drop-shadow-[0px_6px_8px_rgba(40,94,133,0.16)]"
        style={{
          backgroundImage: "linear-gradient(90deg, #285e85, #2f6e99)",
        }}
      >
        <img src={iconCal} alt="" className="h-[26px] w-[26px]" />
      </span>
      <h2 className="font-display text-2xl font-semibold tracking-[0.24px] text-alma-ink">
        {t_1("calendar.connectGoogle")}
      </h2>
      <p className="font-body text-[13.5px] leading-[21px] tracking-[0.135px] text-[rgba(23,50,77,0.65)]">
        ALMA can then see what is coming, add the things you mention in chat, and remind you at the right time - in your
        timezone.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onConnect}
          disabled={connecting}
          className="flex items-center gap-[9px] rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-[13px] ps-5 pe-[22px] font-body text-[13.5px] font-medium tracking-[0.27px] text-white shadow-[0px_4px_12px_0px_rgba(40,94,133,0.16)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <img src={iconLink} alt="" className="brightness-0 invert h-4 w-4" />
          {connecting ? "Opening Google…" : "Connect Google Calendar"}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-[rgba(23,50,77,0.16)] bg-white px-5 py-[13px] font-body text-[13.5px] font-medium tracking-[0.27px] text-[rgba(23,50,77,0.8)] transition-colors hover:bg-alma-panel/40"
        >
          {t_1("calendar.notNow")}
        </button>
      </div>
      <div className="flex items-center gap-[7px]">
        <img src={iconShield} alt="" className="h-[13px] w-[13px]" />
        <p className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.48)]">
          Read-only until you approve writes  ·  Disconnect any time
        </p>
      </div>
    </motion.div>
  );
}
const xe = [
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
const ge = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
function w(t) {
  return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
}
function re(t) {
  return `${xe[t.getMonth()]} ${t.getFullYear()}`;
}
function We(t, a) {
  return new Date(t.getFullYear(), t.getMonth() + a, 1);
}
function Pe(t, a) {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
}
function ze(t, now) {
  const i = new Date(t.getFullYear(), t.getMonth(), 1);
  const n = (i.getDay() + 6) % 7;
  const l = new Date(i.getFullYear(), i.getMonth(), 1 - n);
  const d = w(now);
  const g = [];
  for (let o = 0; o < 6; o++) {
    const s = [];
    for (let c = 0; c < 7; c++) {
      const m = new Date(l.getFullYear(), l.getMonth(), l.getDate() + o * 7 + c);
      s.push({
        key: w(m),
        date: m,
        dayOfMonth: m.getDate(),
        inMonth: m.getMonth() === t.getMonth() && m.getFullYear() === t.getFullYear(),
        isToday: w(m) === d,
        isWeekend: c >= 5,
      });
    }
    g.push(s);
  }
  return g;
}
function Ke(t, now) {
  const i = (t.getDay() + 6) % 7;
  const n = new Date(t.getFullYear(), t.getMonth(), t.getDate() - i);
  const l = w(now);
  return Array.from(
    {
      length: 7,
    },
    (d, g) => {
      const o = new Date(n.getFullYear(), n.getMonth(), n.getDate() + g);
      return {
        key: w(o),
        date: o,
        dayOfMonth: o.getDate(),
        inMonth: o.getMonth() === t.getMonth(),
        isToday: w(o) === l,
        isWeekend: g >= 5,
      };
    },
  );
}
function Je(t) {
  const a = new Map();
  for (const i of t) {
    const n = new Date(i.startIso);
    if (Number.isNaN(n.getTime())) {
      continue;
    }
    const l = w(n);
    const d = a.get(l);
    if (d) {
      d.push(i);
    } else {
      a.set(l, [i]);
    }
  }
  for (const i of a.values()) {
    i.sort((n, l) => new Date(n.startIso).getTime() - new Date(l.startIso).getTime());
  }
  return a;
}
function Z(t) {
  const a = new Date(t.startIso);
  if (Number.isNaN(a.getTime())) {
    return "";
  }
  return a.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
function pe(t) {
  return `${t.toLocaleDateString(undefined, {
    weekday: "long",
  })}, ${t.getDate()} ${xe[t.getMonth()]}`;
}
function Ze(day, now) {
  const i = Math.round(
    (new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86400000,
  );
  switch (i) {
    case 0:
      return "TODAY";
    case 1:
      return "TOMORROW";
    case -1:
      return "YESTERDAY";
    default:
      return day
        .toLocaleDateString(undefined, {
          weekday: "long",
        })
        .toUpperCase();
  }
}
const qe = 8;
const le = 22;
const Qe = 1;
function ce(t) {
  return `${((t + 11) % 12) + 1}${t < 12 || t >= 24 ? "am" : "pm"}`;
}
function Xe(events, a) {
  const i = events
    .map((s) => new Date(s.startIso))
    .filter((s) => !Number.isNaN(s.getTime()))
    .map((s) => s.getHours() + s.getMinutes() / 60)
    .sort((s, c) => s - c);
  if (i.length === 0) {
    return "Nothing scheduled today — the whole day is yours.";
  }
  let n = qe;
  let l = 0;
  let d = 0;
  for (const s of i) {
    if (s - n > d) {
      d = s - n;
      l = n;
    }
    n = Math.max(n, s + Qe);
  }
  if (le - n > d) {
    d = le - n;
    l = n;
  }
  if (d < 2) {
    return `${i.length} ${i.length === 1 ? "thing" : "things"} on today, back to back.`;
  }
  const g = Math.round(l);
  const o = Math.round(l + d);
  return `You have a free stretch from ${ce(g)} to ${ce(o)} today.`;
}
function Me1Component({ event, onClick, className }) {
  const n = event.source === "alma";
  const l = Z(event);
  return (
    <button
      type="button"
      onClick={onClick}
      title={l ? `${event.title} · ${l}` : event.title}
      className={cn(
        "relative flex w-full items-center overflow-hidden rounded-[6px] border py-[3px] ps-[9px] pe-1.5 text-start transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-alma-accent-ring",
        n
          ? "border-[rgba(40,94,133,0.16)] bg-alma-panel hover:bg-[#eaf3fa]"
          : "border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] hover:bg-white",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 start-0 w-[3px]",
          n ? "bg-[rgba(40,94,133,0.7)]" : "bg-[rgba(23,50,77,0.25)]",
        )}
      />
      <span
        className={cn(
          "truncate font-body text-[10px] font-medium tracking-[0.1px]",
          n ? "text-[rgba(23,50,77,0.95)]" : "text-[rgba(23,50,77,0.75)]",
        )}
      >
        {event.title}
        {l ? ` · ${l}` : ""}
      </span>
    </button>
  );
}
function EtComponent({ weeks, eventsFor, selectedKey, onSelectDay, onOpenEvent }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-[rgba(23,50,77,0.1)] bg-white/85">
      <div className="grid shrink-0 grid-cols-7 border-b border-[rgba(23,50,77,0.08)]">
        {ge.map((d, g) => (
          <div key={d} className="px-3 py-2.5">
            <span
              className={cn(
                "font-body text-[10px] font-medium tracking-[1px]",
                g >= 5 ? "text-[rgba(23,50,77,0.35)]" : "text-[rgba(23,50,77,0.5)]",
              )}
            >
              {d}
            </span>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-6 overflow-y-auto">
        {weeks.map((d, key) => (
          <div key={key} className="grid grid-cols-7">
            {d.map((o) => {
              const s = eventsFor(o.key);
              const c = selectedKey === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => onSelectDay(o)}
                  aria-current={o.isToday ? "date" : undefined}
                  aria-label={o.date.toDateString()}
                  className={cn(
                    "relative flex min-h-[96px] flex-col items-stretch gap-1 border-b border-e border-[rgba(23,50,77,0.07)] p-2 text-start transition-colors",
                    o.isToday ? "bg-[#eaf3fa]" : "hover:bg-[rgba(200,225,242,0.12)]",
                    !o.inMonth && "bg-[rgba(23,50,77,0.015)]",
                    c && "ring-1 ring-inset ring-alma-accent-deep",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-[22px] shrink-0 items-center justify-center rounded-full font-body text-xs",
                      o.isToday
                        ? "bg-gradient-to-r from-alma-accent-from to-alma-accent-to font-semibold text-white"
                        : o.inMonth
                          ? "text-[rgba(23,50,77,0.8)]"
                          : "text-[rgba(23,50,77,0.3)]",
                    )}
                  >
                    {o.dayOfMonth}
                  </span>
                  <div className="flex min-h-0 flex-col gap-1 overflow-hidden">
                    {s.slice(0, 3).map((m) => (
                      <motion.div key={m.id} layout transition={springSnappy} onClick={(b) => b.stopPropagation()}>
                        <Me1Component event={m} onClick={() => onOpenEvent?.(m)} />
                      </motion.div>
                    ))}
                    {s.length > 3 && (
                      <span className="ps-[9px] font-body text-[10px] text-[rgba(23,50,77,0.45)]">
                        +{s.length - 3} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
const iconBell =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='13'%20height='13'%20viewBox='0%200%2013%2013'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/bell'%3e%3cpath%20id='Vector'%20d='M3.25%204.33333C3.25%203.47138%203.59241%202.64473%204.2019%202.03524C4.8114%201.42574%205.63805%201.08333%206.5%201.08333C7.36195%201.08333%208.1886%201.42574%208.7981%202.03524C9.40759%202.64473%209.75%203.47138%209.75%204.33333C9.75%208.125%2011.375%209.20833%2011.375%209.20833H1.625C1.625%209.20833%203.25%208.125%203.25%204.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.45'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M5.57917%2011.375C5.67632%2011.5318%205.8119%2011.6611%205.97304%2011.7509C6.13418%2011.8406%206.31557%2011.8877%206.5%2011.8877C6.68443%2011.8877%206.86582%2011.8406%207.02696%2011.7509C7.1881%2011.6611%207.32368%2011.5318%207.42083%2011.375'%20stroke='%2317324d'%20stroke-opacity='0.45'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconCheck =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/check'%3e%3cpath%20id='Vector'%20d='M11.6667%203.5L5.25%209.91667L2.33333%207'%20stroke='%23285e85'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconSpark =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='13'%20height='13'%20viewBox='0%200%2013%2013'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/spark'%3e%3cpath%20id='Vector'%20d='M6.5%201.625V3.79167M6.5%209.20833V11.375M1.625%206.5H3.79167M9.20833%206.5H11.375M3.25%203.25L4.60417%204.60417M8.39583%208.39583L9.75%209.75M9.75%203.25L8.39583%204.60417M4.60417%208.39583L3.25%209.75'%20stroke='%23285e85'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
function AtComponent({ day, now, events, reminders, note, onOpenEvent, onCompleteReminder }) {
  const { t: t_1 } = useI18n();
  return (
    <aside className="flex w-full shrink-0 flex-col gap-[18px] overflow-y-auto rounded-[18px] border border-[rgba(23,50,77,0.1)] bg-white/90 p-5 lg:w-[320px]">
      <div className="flex flex-col gap-[5px]">
        <p className="font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.42)]">{Ze(day, now)}</p>
        <h2 className="font-display text-[17px] font-semibold tracking-[0.17px] text-alma-ink">{pe(day)}</h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {events.length === 0 ? (
          <p className="rounded-[12px] border border-dashed border-[rgba(23,50,77,0.12)] px-3 py-4 text-center font-body text-xs text-[rgba(23,50,77,0.45)]">
            {t_1("calendar.nothingScheduledShort")}
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {events.map((s) => {
              const c = s.source === "alma";
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  layout
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -6,
                  }}
                  transition={springSnappy}
                  onClick={() => onOpenEvent?.(s)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[12px] border px-3 py-[11px] text-start transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
                    c
                      ? "border-[rgba(40,94,133,0.18)] bg-[#eaf3fa] hover:bg-[#c8e1f2]"
                      : "border-[rgba(23,50,77,0.08)] bg-alma-field hover:bg-white",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 h-[34px] w-[3px] shrink-0 rounded-[2px]",
                      c ? "bg-[rgba(40,94,133,0.7)]" : "bg-[rgba(23,50,77,0.22)]",
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span
                      className={cn(
                        "font-body text-[11px] font-medium tracking-[0.22px]",
                        c ? "text-[rgba(23,50,77,0.9)]" : "text-[rgba(23,50,77,0.6)]",
                      )}
                    >
                      {Z(s)}
                    </span>
                    <span className="truncate font-body text-[13px] font-medium tracking-[0.26px] text-alma-ink">
                      {s.title}
                    </span>
                    {(s.location || s.description) && (
                      <span className="truncate font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.5)]">
                        {s.location || s.description}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        )}
      </div>
      {reminders.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <img src={iconBell} alt="" className="h-[13px] w-[13px]" />
            <p className="font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.42)]">
              {t_1("calendar.fromAlma")}
            </p>
          </div>
          <AnimatePresence initial={false}>
            {reminders.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                }}
                transition={springSnappy}
                className="flex items-center gap-2.5 rounded-[12px] border border-[rgba(23,50,77,0.08)] bg-alma-field py-2.5 ps-3 pe-2.5"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="truncate font-body text-[12.5px] font-medium tracking-[0.25px] text-[rgba(23,50,77,0.95)]">
                    {s.title}
                  </p>
                  <p className="truncate font-body text-[10.5px] tracking-[0.21px] text-[rgba(23,50,77,0.45)]">
                    {s.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCompleteReminder(s.id)}
                  aria-label={`Mark "${s.title}" done`}
                  title={t_1("calendar.markDone")}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(23,50,77,0.12)] bg-white transition-colors hover:border-alma-accent-deep hover:bg-alma-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
                >
                  <img src={iconCheck} alt="" className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {note && (
        <div className="flex flex-col gap-1.5 rounded-[13px] border border-[rgba(40,94,133,0.16)] bg-[#eaf3fa] px-[13px] pb-[13px] pt-3">
          <div className="flex items-center gap-1.5">
            <img src={iconSpark} alt="" className="h-[13px] w-[13px]" />
            <span className="font-body text-[10px] font-semibold tracking-[1px] text-[rgba(23,50,77,0.85)]">ALMA</span>
          </div>
          <p className="font-body text-[11.5px] leading-[17px] tracking-[0.115px] text-[rgba(23,50,77,0.85)]">{note}</p>
        </div>
      )}
    </aside>
  );
}
const Calendar = () => {
  const { t } = useI18n();
  const [a, setA] = React.useState(false);
  const [n, setN] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [o, setO] = React.useState(true);
  const [connecting, setConnecting] = React.useState(false);
  const [b, setB] = React.useState("month");
  const [v, setV] = React.useState(() => new Date());
  const [N, setN_1] = React.useState(null);
  const [$, set$] = React.useState([]);
  const [H, setH] = React.useState(false);
  const { toast } = useToast();
  const R = useNavigate();
  React.useEffect(() => {
    O();
    const r = new URLSearchParams(window.location.search);
    if (r.get("connected") === "true") {
      toast({
        title: "Calendar connected!",
        description: "Your Google Calendar is now connected.",
      });
    }
    if (r.get("error")) {
      toast({
        title: "Connection failed",
        description: r.get("error") || "Unknown error",
        variant: "destructive",
      });
    }
  }, []);
  const O = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        R("/auth");
        return;
      }
      const { data, error } = await supabase.from("google_calendar_tokens").select("*").eq("user_id", user.id).single();
      const D = !error && !!data;
      setA(D);
      await S(D);
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setO(false);
    }
  };
  const S = async (r) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const f = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("reminders")
      .select("id, event_name, event_description, reminder_time, google_event_id, tags, reminder_sent")
      .eq("user_id", user.id)
      .gte("reminder_time", f)
      .order("reminder_time", {
        ascending: true,
      });
    const z = (data ?? []).filter((u) => !u.reminder_sent || (u.tags ?? []).includes("calendar"));
    let te = [];
    if (r) {
      try {
        const { data: data_1, error } = await supabase.functions.invoke("get-calendar-events");
        if (error) {
          throw error;
        }
        te = data_1?.events ?? [];
        if (data_1 != null && data_1.reconnect) {
          setA(false);
          setH(false);
          toast({
            title: "Your Google Calendar needs reconnecting",
            description: "Google asked us to check in again. Your own entries are still here.",
          });
        }
      } catch (error) {
        console.error("Error loading events:", error);
        toast({
          title: "Couldn't load your Google events",
          description: "Your own entries are still shown.",
          variant: "destructive",
        });
      }
    }
    setN(Ve(te, z));
    set$(
      (data ?? [])
        .filter((u) => !u.reminder_sent && !(u.tags ?? []).includes("calendar"))
        .slice(0, 6)
        .map((u) => ({
          id: u.id,
          title: u.event_name ?? "(untitled)",
          subtitle: u.reminder_time
            ? `due ${new Date(u.reminder_time).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              })}`
            : "no date set",
        })),
    );
  };
  const onCreated = () => S(a);
  const onConnect = async () => {
    setConnecting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        R("/auth");
        return;
      }
      const { data, error } = await supabase.functions.invoke("google-oauth-init", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) {
        throw error;
      }
      if (data != null && data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error connecting calendar:", error);
      toast({
        title: "Connection failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };
  const he = React.useCallback(
    async (r) => {
      const h = $;
      set$((D) => D.filter((z) => z.id !== r));
      const { error } = await supabase
        .from("reminders")
        .update({
          reminder_sent: true,
        })
        .eq("id", r);
      if (error) {
        set$(h);
        toast({
          title: "Couldn't mark that done",
          variant: "destructive",
        });
      }
    },
    [$, toast],
  );
  const now = React.useMemo(() => new Date(), []);
  const q = React.useMemo(() => Je(n), [n]);
  const eventsFor = React.useCallback((r) => q.get(r) ?? [], [q]);
  const day = React.useMemo(() => {
    if (!N) {
      return now;
    }
    const [r, h, f] = N.split("-").map(Number);
    return new Date(r, h, f);
  }, [N, now]);
  const weeks = React.useMemo(() => ze(v, now), [v, now]);
  const W = React.useMemo(() => Ke(v, now), [v, now]);
  const events = eventsFor(w(day));
  const title =
    b === "month" ? re(v) : b === "week" ? `${W[0].date.getDate()} – ${W[6].date.getDate()} ${re(v)}` : pe(v);
  const ee = (r) =>
    setV((h) => {
      if (b === "month") {
        return We(h, r);
      }
      return Pe(h, r * (b === "week" ? 7 : 1));
    });
  const onToday = () => {
    setV(new Date());
    setN_1(w(new Date()));
  };
  if (o) {
    return (
      <div className="app-shell-offset flex h-screen w-full items-center justify-center bg-alma-canvas">
        <LoaderCircle className="h-8 w-8 animate-spin text-alma-accent-deep" />
      </div>
    );
  }
  const P = !a && !H;
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <UeComponent
          title={title}
          view={b}
          onViewChange={setB}
          onPrev={() => ee(-1)}
          onNext={() => ee(1)}
          onToday={onToday}
          onNewEvent={() => setOpen(true)}
        />
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-5 px-4 pb-6 sm:px-6 lg:flex-row lg:px-[30px]",
            P && "pointer-events-none select-none opacity-45 blur-[2px]",
          )}
          aria-hidden={P}
        >
          <AnimatePresence mode="wait">
            {b === "month" && (
              <motion.div
                key="month"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={fadeQuick}
                className="flex min-h-0 flex-1 flex-col"
              >
                <EtComponent weeks={weeks} eventsFor={eventsFor} selectedKey={N} onSelectDay={(r) => setN_1(r.key)} />
              </motion.div>
            )}
            {b === "week" && (
              <motion.div
                key="week"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={fadeQuick}
                className="grid min-h-0 flex-1 grid-cols-7 overflow-hidden rounded-[18px] border border-[rgba(23,50,77,0.1)] bg-white/85"
              >
                {W.map((r, h) => (
                  <div
                    key={r.key}
                    className={cn(
                      "flex min-h-0 flex-col border-e border-[rgba(23,50,77,0.07)] last:border-e-0",
                      r.isToday && "bg-[#eaf3fa]",
                    )}
                  >
                    <div className="shrink-0 border-b border-[rgba(23,50,77,0.08)] px-3 py-2.5">
                      <p className="font-body text-[10px] font-medium tracking-[1px] text-[rgba(23,50,77,0.5)]">
                        {ge[h]}
                      </p>
                      <p className="mt-1 font-body text-sm text-[rgba(23,50,77,0.8)]">{r.dayOfMonth}</p>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-2">
                      {eventsFor(r.key).map((f) => (
                        <Me1Component key={f.id} event={f} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            {b === "day" && (
              <motion.div
                key="day"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={fadeQuick}
                className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto rounded-[18px] border border-[rgba(23,50,77,0.1)] bg-white/85 p-5"
              >
                {eventsFor(w(v)).length === 0 ? (
                  <p className="py-16 text-center font-body text-sm text-[rgba(23,50,77,0.45)]">
                    {t("calendar.nothingScheduled")}
                  </p>
                ) : (
                  eventsFor(w(v)).map((r) => (
                    <motion.div
                      key={r.id}
                      layout
                      transition={springSnappy}
                      className="flex items-center gap-4 rounded-[12px] border border-[rgba(23,50,77,0.08)] bg-alma-field px-4 py-3"
                    >
                      <span className="w-16 shrink-0 font-body text-[13px] font-medium text-[rgba(23,50,77,0.6)]">
                        {Z(r)}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-body text-sm font-medium text-alma-ink">
                        {r.title}
                      </span>
                      {r.location && (
                        <span className="hidden truncate font-body text-xs text-[rgba(23,50,77,0.5)] sm:block">
                          {r.location}
                        </span>
                      )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <AtComponent
            day={day}
            now={now}
            events={events}
            reminders={$}
            note={Xe(events)}
            onCompleteReminder={(r) => void he(r)}
          />
        </div>
        <AnimatePresence>
          {P && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={fadeQuick}
              className="absolute inset-0 z-30 flex items-center justify-center px-4"
            >
              <GeComponent connecting={connecting} onConnect={onConnect} onDismiss={() => setH(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <YeComponent open={open} onOpenChange={setOpen} onCreated={onCreated} />
    </div>
  );
};
export default Calendar;
