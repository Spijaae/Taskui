import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { COUNTRIES } from "@/components/auth/PhoneInput";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileTopBar } from "@/components/MobileTopBar";
import {
  GhostPill,
  DangerPill,
  SettingsCard,
  PrimaryPill,
  ReadonlyField,
  SettingsRow,
  SettingsSwitch,
  iconTrash,
} from "@/components/settings/SettingsParts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconMenu, iconMsg } from "@/lib/appIcons";
import { getLanguagePreference, LANGUAGES } from "@/lib/profile";
import {
  DEFAULT_MEMORY_PREFS,
  readMemoryPrefs,
  writeMemoryPrefs,
  exportFileName,
  activeCheckinSlot,
  memberSince,
  timezoneLabel,
  slotFlags,
  iconClock,
} from "@/lib/settingsPrefs";
import { TIMEZONES } from "@/lib/timezones";

const w = "DELETE";
function ft(n, c) {
  if (c) {
    return "Deleting…";
  }
  if (n.trim() !== w) {
    return `Type ${w} to confirm`;
  }
  return null;
}
function GtComponent({ open, onOpenChange }) {
  const { t } = useI18n();
  const [y, setY] = React.useState("");
  const [u, setU] = React.useState(false);
  const v = useNavigate();
  React.useEffect(() => {
    if (open) {
      setY("");
    }
  }, [open]);
  const _ = ft(y, u);
  const E = async () => {
    if (!_) {
      setU(true);
      try {
        const { data, error } = await supabase.functions.invoke("delete-account", {
          body: {
            confirm: w,
          },
        });
        if (error) {
          throw error;
        }
        if (data && data.ok === false) {
          throw new Error(data.error ?? "Deletion failed");
        }
        await supabase.auth.signOut();
        toast.success("Your account and everything in it has been deleted.");
        v("/", {
          replace: true,
        });
      } catch (error) {
        console.error("Account deletion failed:", error);
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : "Couldn't delete your account. Nothing has been removed — please try again.",
        );
        setU(false);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={(m) => !u && onOpenChange(m)}>
      <DialogContent className="max-w-[440px] border-alma-line bg-white">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-semibold tracking-[0.18px] text-[#b3261e]">
            {t("account.deleteTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <p className="font-body text-[13.5px] leading-6 tracking-[0.14px] text-alma-ink">
            This removes your memories, photos, voice notes and transcripts, and everything ALMA worked out from them —
            so recall stops answering from them too. It cannot be undone.
          </p>
          <p className="font-body text-xs leading-5 tracking-[0.12px] text-alma-muted">
            Our database provider keeps backups for a short period, and those expire on their own schedule. If you want
            a copy of anything, export it first.
          </p>
          <label className="mt-1 flex flex-col gap-1.5">
            <span className="font-body text-[10px] font-medium uppercase tracking-[1px] text-alma-muted">
              Type {w} to confirm
            </span>
            <input
              value={y}
              onChange={(m) => setY(m.target.value)}
              disabled={u}
              autoComplete="off"
              aria-label={`Type ${w} to confirm`}
              className="h-11 w-full rounded-[12px] border border-[rgba(179,38,30,0.25)] bg-[#fdf1f0] px-3.5 font-body text-[14px] tracking-[0.28px] text-[#b3261e] outline-none placeholder:text-[rgba(179,38,30,0.4)] focus:border-[#b3261e] disabled:opacity-60"
              placeholder={w}
            />
          </label>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5">
          <GhostPill onClick={() => onOpenChange(false)} disabled={u}>
            {t("account.keepMine")}
          </GhostPill>
          <DangerPill onClick={E} disabled={!!_} title={_ ?? undefined}>
            {u ? "Deleting…" : "Delete everything"}
          </DangerPill>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function ht(n) {
  const c = String(n ?? "").toLowerCase();
  const d = c.includes("macintosh") && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/.test(c) || d) {
    return "ios";
  }
  if (c.includes("android")) {
    return "android";
  }
  return "desktop";
}
function bt(n) {
  switch (n) {
    case "ios":
      return {
        title: "Add Alma to your home screen",
        steps: [
          "Tap the Share button at the bottom of Safari (the square with an arrow).",
          "Scroll down and tap “Add to Home Screen”.",
          "Tap “Add”. Alma will open like an app, without the browser bars.",
        ],
        note: "Safari is the only iPhone browser that can do this. Alma works the same in any browser — the icon is just a shortcut.",
      };
    case "android":
      return {
        title: "Add Alma to your home screen",
        steps: [
          "Tap the menu button in your browser (usually ⋮ at the top right).",
          "Tap “Add to Home screen” or “Install app”.",
          "Confirm. Alma will open from your home screen like an app.",
        ],
        note: "The exact wording varies by browser and phone. Alma works the same either way.",
      };
    default:
      return {
        title: "Keep Alma one click away",
        steps: [
          "Look for an install icon in the address bar (a screen with a downward arrow).",
          "If there isn't one, bookmark this page instead — Alma works the same in a tab.",
        ],
        note: "Installing is optional. Nothing about your vault depends on it.",
      };
  }
}
function YtComponent({ open, onOpenChange }) {
  const d = React.useMemo(() => ht(typeof navigator === "undefined" ? "" : navigator.userAgent), []);
  const { title, steps, note } = bt(d);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] border-alma-line bg-white">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-semibold tracking-[0.18px] text-alma-ink">
            {title}
          </DialogTitle>
        </DialogHeader>
        <ol className="flex flex-col gap-3">
          {steps.map((b, v) => (
            <li key={b} className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-alma-panel font-body text-[11px] font-semibold text-alma-ink">
                {v + 1}
              </span>
              <span className="font-body text-[13.5px] leading-[22px] tracking-[0.13px] text-alma-ink">{b}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 font-body text-[12px] leading-5 tracking-[0.12px] text-alma-muted">{note}</p>
      </DialogContent>
    </Dialog>
  );
}
const iconDl =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/dl'%3e%3cpath%20id='Vector'%20d='M13.125%209.375V11.875C13.125%2012.2065%2012.9933%2012.5245%2012.7589%2012.7589C12.5245%2012.9933%2012.2065%2013.125%2011.875%2013.125H3.125C2.79348%2013.125%202.47554%2012.9933%202.24112%2012.7589C2.0067%2012.5245%201.875%2012.2065%201.875%2011.875V9.375'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M4.375%206.25L7.5%209.375L10.625%206.25'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M7.5%209.375V1.875'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const ve = {
  enabled: false,
  morning_at: "08:00",
  midday_at: "13:00",
  evening_at: "20:00",
  last_morning_sent: null,
  last_midday_sent: null,
  last_evening_sent: null,
};
function kt(event_date, reminder_time) {
  if (!reminder_time) {
    return event_date;
  }
  if (reminder_time.includes("T")) {
    const d = new Date(reminder_time);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  }
  if (/^\d{2}:\d{2}/.test(reminder_time)) {
    return `${event_date} · ${reminder_time.slice(0, 5)} UTC`;
  }
  return event_date;
}
export default function Settings() {
  const [n, setN] = React.useState(null);
  const [d, setD] = React.useState("");
  const [p, setP] = React.useState(ve);
  const [b, setB] = React.useState([]);
  const [_, set_] = React.useState([]);
  const [m, setM] = React.useState(false);
  const [Te, setTe] = React.useState(true);
  const [Le, setLe] = React.useState(false);
  const [J, setJ] = React.useState("+91");
  const [Z, setZ] = React.useState("");
  const [K, setK] = React.useState(false);
  const [X, setX] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);
  const [De, setDe] = React.useState(false);
  const [O, setO] = React.useState("");
  const [ae, setAe] = React.useState("");
  const [Me, setMe] = React.useState(null);
  const [ne, setNe] = React.useState(false);
  const [ie, setIe] = React.useState("");
  const [re, setRe] = React.useState(false);
  const [j, setJ_1] = React.useState(DEFAULT_MEMORY_PREFS);
  const [le, setLe_1] = React.useState(false);
  const [qe, setQe] = React.useState(false);
  const { t: t_2, setLanguage } = useI18n();
  const ze = useMobileNav();
  const [$e, set$e] = React.useState(false);
  const [C, setC] = React.useState("en");
  React.useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      setN(user.id);
      const [{ data }, { data: data_1 }, { data: data_2 }] = await Promise.all([
        supabase
          .from("profiles")
          .select("phone, preferences, timezone, display_name, created_at")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("reminders")
          .select("id, event_name, event_date, reminder_time, reminder_sent")
          .eq("user_id", user.id)
          .eq("reminder_sent", false)
          .order("event_date", {
            ascending: true,
          }),
        supabase.from("user_lists").select("id, list_name").eq("user_id", user.id),
      ]);
      setD(data?.phone ?? "");
      setAe(user.email ?? "");
      setO(data?.display_name ?? "");
      setIe(data?.display_name ?? "");
      setMe(data?.created_at ?? user.created_at ?? null);
      setJ_1(readMemoryPrefs(data?.preferences));
      setC(
        getLanguagePreference({
          preferences: data?.preferences,
        }),
      );
      const f = data?.phone ?? "";
      if (f) {
        const S = COUNTRIES.find((V) => f.startsWith(V.code));
        if (S) {
          setJ(S.code);
          setZ(f.slice(S.code.length));
        } else {
          setJ("+91");
          setZ(f.replace(/^\+/, ""));
        }
      }
      const B = data?.preferences ?? {};
      setP({
        ...ve,
        ...(B.whatsapp ?? {}),
      });
      setX((data?.timezone ?? "") || "");
      setB(data_1 ?? []);
      set_(data_2 ?? []);
      setTe(false);
    })();
  }, []);
  async function Ie() {
    if (!n) {
      return;
    }
    setM(true);
    const { data } = await supabase.from("profiles").select("preferences").eq("user_id", n).maybeSingle();
    const a = {
      ...(data?.preferences ?? {}),
      whatsapp: p,
    };
    const { error } = await supabase
      .from("profiles")
      .update({
        preferences: a,
      })
      .eq("user_id", n);
    setM(false);
    if (error) {
      console.error("settings save failed:", error);
      toast.error(t_2("settings.err.save"));
    } else {
      toast.success(t_2("settings.ok.saved"));
    }
  }
  async function Ue(t) {
    const { error } = await supabase
      .from("reminders")
      .update({
        reminder_sent: true,
      })
      .eq("id", t);
    if (error) {
      toast.error(t_2("settings.err.cancel"));
      return;
    }
    setB((o) => o.filter((x) => x.id !== t));
    toast.success(t_2("settings.ok.reminderCancelled"));
  }
  async function We() {
    if (!n) {
      return;
    }
    const phone = `${J}${Z}`;
    if (!/^\+[1-9]\d{9,14}$/.test(phone)) {
      toast.error(t_2("settings.err.badPhone"));
      return;
    }
    setK(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        phone,
      })
      .eq("user_id", n);
    setK(false);
    if (error) {
      toast.error(t_2("settings.err.save"));
      return;
    }
    setD(phone);
    setLe(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`alma:phone-nudge-dismissed:${n}`, "1");
    }
    toast.success(t_2("settings.ok.phoneSaved"));
  }
  function pe(t) {
    const a = COUNTRIES.find((o) => t.startsWith(o.code));
    if (a) {
      return `${a.code} ${t.slice(a.code.length)}`;
    }
    return t;
  }
  const xe = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
  async function Fe(language) {
    if (!n || language === C) {
      return;
    }
    const a = C;
    setC(language);
    setLanguage(language);
    const { data } = await supabase.from("profiles").select("preferences").eq("user_id", n).maybeSingle();
    const x = {
      ...(data?.preferences ?? {}),
      language,
    };
    const { error } = await supabase
      .from("profiles")
      .update({
        preferences: x,
      })
      .eq("user_id", n);
    if (error) {
      setC(a);
      setLanguage(a);
      toast.error(t_2("settings.err.save"));
      return;
    }
    setLanguage(language);
    toast.success(t_2("settings.ok.languageSaved"));
  }
  async function onValueChange(timezone) {
    if (!n) {
      return;
    }
    setDisabled(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        timezone,
      })
      .eq("user_id", n);
    setDisabled(false);
    if (error) {
      toast.error(t_2("settings.err.save"));
      return;
    }
    setX(timezone);
    setDe(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`alma:tz-synced:${n}`);
    }
    toast.success(t_2("settings.ok.timezoneSaved"));
  }
  async function Ve() {
    if (!n) {
      return;
    }
    const display_name = ie.trim();
    if (!display_name) {
      toast.error(t_2("settings.err.emptyName"));
      return;
    }
    setRe(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name,
      })
      .eq("user_id", n);
    setRe(false);
    if (error) {
      toast.error(t_2("settings.err.save"));
      return;
    }
    setO(display_name);
    setNe(false);
    toast.success(t_2("settings.ok.nameSaved"));
  }
  async function I(t) {
    if (!n) {
      return;
    }
    const a = j;
    setJ_1(t);
    const { data } = await supabase.from("profiles").select("preferences").eq("user_id", n).maybeSingle();
    const { error } = await supabase
      .from("profiles")
      .update({
        preferences: writeMemoryPrefs(data?.preferences, t),
      })
      .eq("user_id", n);
    if (error) {
      setJ_1(a);
      toast.error(t_2("settings.err.save"));
    }
  }
  async function He() {
    if (n) {
      setLe_1(true);
      try {
        const [t, a, o, x, f, B, S] = await Promise.all([
          supabase.from("profiles").select("*").eq("user_id", n).maybeSingle(),
          supabase.from("memories").select("*").eq("user_id", n),
          supabase.from("reminders").select("*").eq("user_id", n),
          supabase.from("user_lists").select("*").eq("user_id", n),
          supabase.from("list_items").select("*"),
          supabase.from("conversations").select("*").eq("user_id", n),
          supabase.from("chat_messages").select("*").eq("user_id", n),
        ]);
        const V = {
          exported_at: new Date().toISOString(),
          profile: t.data ?? null,
          memories: a.data ?? [],
          reminders: o.data ?? [],
          lists: x.data ?? [],
          list_items: f.data ?? [],
          conversations: B.data ?? [],
          chat_messages: S.data ?? [],
        };
        const Je = new Blob([JSON.stringify(V, null, 2)], {
          type: "application/json",
        });
        const fe = URL.createObjectURL(Je);
        const H = document.createElement("a");
        H.href = fe;
        H.download = exportFileName();
        H.click();
        URL.revokeObjectURL(fe);
        toast.success(t_2("settings.ok.exported"));
      } catch (error) {
        console.error("Export failed:", error);
        toast.error(t_2("settings.err.export"));
      } finally {
        setLe_1(false);
      }
    }
  }
  const Ge = (O || ae || "?").charAt(0).toUpperCase();
  const U = !!d && p.enabled;
  const W = p.checkin_on !== false;
  const Ye = activeCheckinSlot(p);
  function F(t) {
    setP({
      ...p,
      ...t,
    });
  }
  const UeComponent = (t) => (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileTopBar
          title={t_2("settings.account")}
          subtitle={t_2("settings.heading")}
          leading={{
            icon: iconMenu,
            label: t_2("nav.menu"),
            onClick: ze.open,
          }}
        />
        <div className="hidden shrink-0 flex-col gap-3 px-4 sm:px-[30px] pb-8 pt-[38px] md:flex">
          <p className="font-body text-sm tracking-[0.14px] text-[rgba(23,50,77,0.6)]">{t_2("settings.heading")}</p>
          <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">
            {t_2("settings.account")}
          </h1>
        </div>
        {t}
      </div>
    </div>
  );
  return UeComponent(
    Te ? (
      <p className="px-4 sm:px-[30px] pb-10 font-body text-sm text-[rgba(23,50,77,0.5)]">Loading…</p>
    ) : (
      <div className="grid gap-5 px-4 sm:px-[30px] pb-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SettingsCard>
            <div className="flex items-center gap-3.5">
              <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-[rgba(87,101,255,0.25)] bg-[#eef0ff] font-body text-xl font-semibold text-[#5765ff]">
                {Ge}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                {ne ? (
                  <input
                    value={ie}
                    onChange={(t) => setIe(t.target.value)}
                    autoFocus
                    aria-label={t_2("settings.displayName")}
                    className="w-full rounded-[10px] border border-[rgba(23,50,77,0.12)] bg-alma-field px-3 py-2 font-body text-[15px] text-alma-ink outline-none focus:border-alma-accent-deep"
                  />
                ) : (
                  <p className="truncate font-display text-[17px] font-semibold tracking-[0.17px] text-alma-ink">
                    {O || "Add your name"}
                  </p>
                )}
                <p className="truncate font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.5)]">
                  {[ae, memberSince(Me)].filter(Boolean).join("  ·  ")}
                </p>
              </div>
              {ne ? (
                <div className="flex shrink-0 gap-2">
                  <GhostPill
                    onClick={() => {
                      setIe(O);
                      setNe(false);
                    }}
                  >
                    {t_2("action.cancel")}
                  </GhostPill>
                  <PrimaryPill onClick={Ve} disabled={re}>
                    {re ? "Saving…" : "Save"}
                  </PrimaryPill>
                </div>
              ) : (
                <GhostPill onClick={() => setNe(true)}>{t_2("action.edit")}</GhostPill>
              )}
            </div>
          </SettingsCard>
          <SettingsCard
            title={t_2("settings.phone")}
            description="Used for the WhatsApp agent, OTP sign-in, and daily check-ins."
          >
            {!Le && d ? (
              <div className="flex items-center gap-2.5">
                <ReadonlyField className="flex-1">{pe(d)}</ReadonlyField>
                <GhostPill onClick={() => setLe(true)}>{t_2("action.change")}</GhostPill>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5">
                <Select value={J} onValueChange={setJ}>
                  <SelectTrigger className="h-[42px] w-[124px] rounded-[12px] border-[rgba(23,50,77,0.12)] bg-alma-field font-body text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((t, a) => (
                      <SelectItem key={`${t.code}-${t.name}-${a}`} value={t.code}>
                        {t.flag} {t.iso} {t.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  value={Z}
                  onChange={(t) => setZ(t.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="98765 43210"
                  aria-label={t_2("settings.phone")}
                  className="min-w-0 flex-1 rounded-[12px] border border-[rgba(23,50,77,0.12)] bg-alma-field px-3.5 py-3 font-body text-[13px] tracking-[0.26px] text-[rgba(23,50,77,0.9)] outline-none focus:border-alma-accent-deep"
                />
                <PrimaryPill onClick={We} disabled={K}>
                  {K ? "Saving…" : "Save"}
                </PrimaryPill>
              </div>
            )}
          </SettingsCard>
          <SettingsCard title={t_2("settings.timezone")} description={t_2("settings.tzNote")}>
            {De ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <Select value={X || xe} onValueChange={onValueChange}>
                  <SelectTrigger className="h-[42px] min-w-0 flex-1 rounded-[12px] border-[rgba(23,50,77,0.12)] bg-alma-field font-body text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((t) => (
                      <SelectItem key={t.name} value={t.name}>
                        {t.label} ({t.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <GhostPill onClick={() => setDe(false)} disabled={disabled}>
                  {t_2("action.cancel")}
                </GhostPill>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <ReadonlyField className="flex-1">{timezoneLabel(X || xe)}</ReadonlyField>
                <GhostPill onClick={() => setDe(true)}>{t_2("action.change")}</GhostPill>
              </div>
            )}
          </SettingsCard>
          <SettingsCard
            title={t_2("settings.language")}
            description="Which language Alma replies in. You can still write in either, and mix them."
          >
            <div className="flex flex-wrap items-center gap-2.5">
              {LANGUAGES.map((t) => (
                <button
                  key={t.code}
                  type="button"
                  onClick={() => void Fe(t.code)}
                  aria-pressed={C === t.code}
                  className={`rounded-[24px] border px-4 py-2 font-body text-[13px] tracking-[0.26px] transition-colors ${C === t.code ? "border-transparent bg-alma-panel text-alma-ink" : "border-alma-line bg-white text-alma-muted hover:bg-alma-soft"}`}
                >
                  {t.label}
                  <span dir={t.code === "ar" ? "rtl" : "ltr"} className="ms-2 opacity-60">
                    {t.native}
                  </span>
                </button>
              ))}
            </div>
          </SettingsCard>
          <SettingsCard title={t_2("settings.memoryPrefs")}>
            <SettingsRow label={t_2("settings.autoTag")} hint="ALMA groups faces it has seen before.">
              <SettingsSwitch
                label={t_2("settings.autoTag")}
                checked={j.autoTagPeople}
                onCheckedChange={(autoTagPeople) =>
                  I({
                    ...j,
                    autoTagPeople,
                  })
                }
              />
            </SettingsRow>
            <SettingsRow label={t_2("settings.weeklyReflection")} hint="A short note on what you kept, every Sunday.">
              <SettingsSwitch
                label={t_2("settings.weeklyReflection")}
                checked={j.weeklyReflection}
                onCheckedChange={(weeklyReflection) =>
                  I({
                    ...j,
                    weeklyReflection,
                  })
                }
              />
            </SettingsRow>
            <SettingsRow label={t_2("settings.suggestRevisit")} hint="Surface something from a year ago.">
              <SettingsSwitch
                label={t_2("settings.suggestRevisit")}
                checked={j.suggestRevisits}
                onCheckedChange={(suggestRevisits) =>
                  I({
                    ...j,
                    suggestRevisits,
                  })
                }
              />
            </SettingsRow>
          </SettingsCard>
          {b.length > 0 && (
            <SettingsCard title={t_2("settings.reminders")} description={t_2("settings.checkinCancelNote")}>
              {b.map((t) => (
                <SettingsRow key={t.id} label={t.event_name} hint={kt(t.event_date, t.reminder_time)}>
                  <GhostPill onClick={() => Ue(t.id)}>{t_2("action.cancel")}</GhostPill>
                </SettingsRow>
              ))}
            </SettingsCard>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <SettingsCard title={t_2("settings.whatsapp")} description={t_2("settings.waNote")}>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`size-2 shrink-0 rounded-full ${U ? "bg-alma-accent-deep" : "bg-[#e8a33d]"}`} />
              <p className="font-body text-[13px] font-medium tracking-[0.26px] text-[rgba(23,50,77,0.9)]">
                {U ? "Linked" : "Not linked yet"}
              </p>
              <span className="flex-1" />
              <p className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.45)]">
                one-time setup, ~30 seconds
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <PrimaryPill
                onClick={() => {
                  if (!d) {
                    toast.error(t_2("settings.err.phoneFirst"));
                    return;
                  }
                  setP({
                    ...p,
                    enabled: !p.enabled,
                  });
                }}
              >
                <img src={iconMsg} alt="" className="h-[15px] w-[15px]" />
                {U ? "Unlink WhatsApp" : "Link WhatsApp"}
              </PrimaryPill>
              <span className="flex-1" />
              <p className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.45)]">
                {d ? `We text ${pe(d)}` : "Add a phone number to link"}
              </p>
            </div>
          </SettingsCard>
          <SettingsCard
            title={t_2("settings.checkins")}
            description="One invitation a day, at the time you choose. Reply, skip or pause any time."
          >
            <div className="flex items-center gap-3">
              <p className="font-body text-[13px] font-medium tracking-[0.26px] text-[rgba(23,50,77,0.95)]">
                {t_2("settings.checkin.send")}
              </p>
              <span className="flex-1" />
              <SettingsSwitch
                label={t_2("settings.checkinTitle")}
                checked={W}
                onCheckedChange={(checkin_on) =>
                  F({
                    checkin_on,
                  })
                }
              />
            </div>
            <div className="h-px w-full bg-[rgba(23,50,77,0.09)]" />
            <fieldset className="flex flex-col gap-3" disabled={!W}>
              <legend className="sr-only">{t_2("settings.checkinWhen")}</legend>
              {[
                ["Morning", "morning", "morning_at"],
                ["Midday", "midday", "midday_at"],
                ["Evening", "evening", "evening_at"],
              ].map(([t, a, o]) => {
                const x = Ye === a;
                return (
                  <label
                    key={a}
                    className={`flex items-center gap-3 rounded-[10px] px-1 py-0.5 transition-opacity ${W ? "cursor-pointer" : "opacity-50"}`}
                  >
                    <input
                      type="radio"
                      name="checkin-slot"
                      checked={x}
                      onChange={() => F(slotFlags(a))}
                      className="size-[15px] shrink-0 accent-alma-action"
                    />
                    <img src={iconClock} alt="" className="h-[15px] w-[15px] shrink-0" />
                    <p className="font-body text-[13px] font-medium tracking-[0.26px] text-[rgba(23,50,77,0.95)]">
                      {t}
                    </p>
                    <span className="flex-1" />
                    <input
                      type="time"
                      dir="ltr"
                      value={p[o]}
                      onChange={(f) =>
                        F({
                          [o]: f.target.value,
                        })
                      }
                      aria-label={`${t} check-in time`}
                      className={`rounded-full border px-3.5 py-[7px] font-body text-[12.5px] font-medium tracking-[0.25px] outline-none ${x ? "border-[rgba(23,50,77,0.14)] bg-[#eaf3fa] text-[#17324d]" : "border-[rgba(23,50,77,0.1)] bg-alma-field text-[rgba(23,50,77,0.5)]"}`}
                    />
                  </label>
                );
              })}
            </fieldset>
            <div className="flex justify-end">
              <PrimaryPill onClick={Ie} disabled={m}>
                {m ? "Saving…" : "Save check-ins"}
              </PrimaryPill>
            </div>
          </SettingsCard>
          <SettingsCard title={t_2("settings.data")} description={t_2("settings.dataNote")}>
            <SettingsRow label={t_2("settings.export")} hint="Photos, notes, transcripts and tags as a .json">
              <GhostPill onClick={He} disabled={le}>
                <img src={iconDl} alt="" className="h-[15px] w-[15px]" />
                {le ? "Building…" : "Export"}
              </GhostPill>
            </SettingsRow>
            <div className="h-px w-full bg-[rgba(23,50,77,0.09)]" />
            <SettingsRow label={t_2("settings.homeScreen")} hint="Opens like an app. Optional — nothing depends on it.">
              <GhostPill onClick={() => set$e(true)}>{t_2("settings.how")}</GhostPill>
            </SettingsRow>
            <div className="h-px w-full bg-[rgba(23,50,77,0.09)]" />
            <SettingsRow
              label={t_2("settings.deleteAccount")}
              hint="Removes your memories, photos, transcripts and everything ALMA learned from them. This cannot be undone."
              labelClassName="text-[#b3261e]"
            >
              <DangerPill onClick={() => setQe(true)}>
                <img src={iconTrash} alt="" className="h-[15px] w-[15px]" />
                {t_2("action.delete")}
              </DangerPill>
            </SettingsRow>
          </SettingsCard>
        </div>
        <GtComponent open={qe} onOpenChange={setQe} />
        <YtComponent open={$e} onOpenChange={set$e} />
      </div>
    ),
  );
}
