import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlmaHomeLink } from "@/components/auth/AuthArt";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  needsSetup,
  createSetupDraft,
  validateSetupStep,
  buildSetupUpdate,
  LANGUAGES,
  CONSENT_POINTS,
} from "@/lib/profile";
import { TIMEZONES } from "@/lib/timezones";
import { cn } from "@/lib/utils";

const u = ["name", "language", "consent", "timezone", "checkin"];
const V = [
  {
    key: "morning",
    labelKey: "setup.slot.morning",
    at: "08:00",
  },
  {
    key: "midday",
    labelKey: "setup.slot.midday",
    at: "13:00",
  },
  {
    key: "evening",
    labelKey: "setup.slot.evening",
    at: "20:00",
  },
];
export default function Setup() {
  const o = useNavigate();
  const { t, setLanguage } = useI18n();
  const [y, setY] = React.useState(null);
  const [s, setS] = React.useState(null);
  const [d, setD] = React.useState(0);
  const [h, setH] = React.useState(false);
  const [A, setA] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        o("/auth", {
          replace: true,
        });
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("display_name, timezone, phone, preferences")
        .eq("user_id", user.id)
        .maybeSingle();
      const c = data ?? {};
      if (!needsSetup(c)) {
        o("/today", {
          replace: true,
        });
        return;
      }
      setY(c);
      setS(createSetupDraft(c));
      setA(false);
    })();
  }, [o]);
  const i = u[d];
  const v = d === u.length - 1;
  const f = React.useMemo(() => {
    if (s) {
      return validateSetupStep(i, s);
    }
    return null;
  }, [s, i]);
  const E = React.useCallback(async () => {
    if (s) {
      setH(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("not signed in");
        }
        const n = buildSetupUpdate(y, s);
        const { error } = await supabase
          .from("profiles")
          .update({
            ...n,
            preferences: n.preferences,
          })
          .eq("user_id", user.id);
        if (error) {
          throw error;
        }
        toast.success(t("setup.ok.done"));
        o("/today", {
          replace: true,
        });
      } catch (error) {
        console.error("Setup save failed:", error);
        toast.error(t("setup.err.save"));
        setH(false);
      }
    }
  }, [o, y, s, t]);
  const onClick = () => {
    if (f) {
      toast.error(f);
      return;
    }
    if (v) {
      E();
    } else {
      setD((e) => e + 1);
    }
  };
  if (A || !s) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alma-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-alma-action" />
      </div>
    );
  }
  const r = (e) =>
    setS(
      (n) =>
        n && {
          ...n,
          ...e,
        },
    );
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-alma-canvas px-4 py-10">
      <AlmaHomeLink />
      <div className="mt-8 w-full max-w-[520px]">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {u.map((key, n) => (
            <span
              key={key}
              className={cn("h-1 flex-1 rounded-full transition-colors", n <= d ? "bg-alma-action" : "bg-alma-line")}
            />
          ))}
        </div>
        <p className="mt-3 font-body text-[11.5px] uppercase tracking-[1px] text-alma-muted">
          {t("setup.step", {
            current: d + 1,
            total: u.length,
          })}
        </p>
        <div className="mt-5 rounded-[14px] border border-alma-line bg-white p-6">
          {i === "name" && (
            <M1Component title={t("setup.name.title")} body={t("setup.name.body")}>
              <input
                autoFocus
                value={s.name}
                onChange={(e) =>
                  r({
                    name: e.target.value,
                  })
                }
                onKeyDown={(e) => e.key === "Enter" && onClick()}
                placeholder={t("setup.name.placeholder")}
                className="h-12 w-full rounded-[12px] border border-alma-line bg-alma-field px-4 font-body text-[15px] text-alma-ink outline-none focus:border-alma-action"
              />
            </M1Component>
          )}
          {i === "language" && (
            <M1Component title={t("setup.language.title")} body={t("setup.language.body")}>
              <div className="flex flex-col gap-2.5">
                {LANGUAGES.map((e) => (
                  <button
                    key={e.code}
                    type="button"
                    onClick={() => {
                      r({
                        language: e.code,
                      });
                      setLanguage(e.code);
                    }}
                    aria-pressed={s.language === e.code}
                    className={cn(
                      "flex items-center justify-between rounded-[12px] border px-4 py-3.5 text-start transition-colors",
                      s.language === e.code
                        ? "border-alma-action bg-alma-soft"
                        : "border-alma-line bg-white hover:bg-alma-soft",
                    )}
                  >
                    <span className="font-body text-[15px] text-alma-ink">{e.label}</span>
                    <span dir={e.code === "ar" ? "rtl" : "ltr"} className="font-body text-[15px] text-alma-muted">
                      {e.native}
                    </span>
                  </button>
                ))}
              </div>
            </M1Component>
          )}
          {i === "consent" && (
            <M1Component title={t("setup.consent.title")} body={t("setup.consent.body")}>
              <ul className="flex flex-col gap-3">
                {CONSENT_POINTS.map((e) => (
                  <li key={e} className="flex gap-2.5">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-alma-action" />
                    <span className="font-body text-[13.5px] leading-[23px] tracking-[0.13px] text-alma-ink">{e}</span>
                  </li>
                ))}
              </ul>
              <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-[12px] bg-alma-soft p-4">
                <input
                  type="checkbox"
                  checked={!!s.consentAt}
                  onChange={(e) =>
                    r({
                      consentAt: e.target.checked ? new Date().toISOString() : null,
                    })
                  }
                  className="mt-0.5 size-4 shrink-0 accent-alma-action"
                />
                <span className="font-body text-[13.5px] leading-[22px] text-alma-ink">{t("setup.consent.agree")}</span>
              </label>
            </M1Component>
          )}
          {i === "timezone" && (
            <M1Component title={t("setup.timezone.title")} body={t("setup.timezone.body")}>
              <Select
                value={s.timezone}
                onValueChange={(timezone) =>
                  r({
                    timezone,
                  })
                }
              >
                <SelectTrigger className="h-12 rounded-[12px] border-alma-line bg-alma-field font-body text-[15px] text-alma-ink">
                  <SelectValue placeholder={t("setup.timezone.placeholder")} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {TIMEZONES.map((e) => (
                    <SelectItem key={e.name} value={e.name}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </M1Component>
          )}
          {i === "checkin" && (
            <M1Component title={t("setup.checkin.title")} body={t("setup.checkin.body")}>
              <div className="flex flex-col gap-2.5">
                {V.map((e) => (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() =>
                      r({
                        checkinSlot: e.key,
                        checkinAt: e.at,
                      })
                    }
                    aria-pressed={!!s.checkinAt && s.checkinSlot === e.key}
                    className={cn(
                      "flex items-center justify-between rounded-[12px] border px-4 py-3.5 transition-colors",
                      s.checkinAt && s.checkinSlot === e.key
                        ? "border-alma-action bg-alma-soft"
                        : "border-alma-line bg-white hover:bg-alma-soft",
                    )}
                  >
                    <span className="font-body text-[15px] text-alma-ink">{t(e.labelKey)}</span>
                    <span className="font-body text-[13px] text-alma-muted">{e.at}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    r({
                      checkinAt: "",
                    })
                  }
                  aria-pressed={!s.checkinAt}
                  className={cn(
                    "rounded-[12px] border px-4 py-3.5 text-start font-body text-[15px] transition-colors",
                    s.checkinAt
                      ? "border-alma-line bg-white text-alma-muted hover:bg-alma-soft"
                      : "border-alma-action bg-alma-soft text-alma-ink",
                  )}
                >
                  {t("setup.checkin.decline")}
                </button>
              </div>
            </M1Component>
          )}
          <div className="mt-6 flex items-center gap-3">
            {d > 0 && (
              <button
                type="button"
                onClick={() => setD((e) => e - 1)}
                disabled={h}
                className="rounded-full border border-alma-line bg-white px-5 py-3 font-body text-[14px] tracking-[0.28px] text-alma-muted transition-colors hover:bg-alma-soft"
              >
                {t("action.back")}
              </button>
            )}
            <span className="flex-1" />
            <button
              type="button"
              onClick={onClick}
              disabled={h || !!f}
              className="rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-6 py-3 font-body text-[14px] font-medium tracking-[0.28px] text-white shadow-[0px_2px_6px_0px_rgba(40,94,133,0.18)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t(h ? "action.saving" : v ? "action.finish" : "action.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function M1Component({ title, body, children }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-[22px] font-semibold leading-tight tracking-[0.22px] text-alma-ink">{title}</h1>
      <p className="font-body text-[13.5px] leading-[23px] tracking-[0.13px] text-alma-muted">{body}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
