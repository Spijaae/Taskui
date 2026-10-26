import React from "react";
import { supabase } from "@/integrations/supabase/client";

export function isValidTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone,
    });
    return true;
  } catch {
    return false;
  }
}
export function useTimezoneSync(e) {
  React.useEffect(() => {
    if (!e || typeof window === "undefined") {
      return;
    }
    const t = `alma:tz-synced:${e}`;
    if (window.localStorage.getItem(t)) {
      return;
    }
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone || !isValidTimeZone(timeZone)) {
      return;
    }
    let r = false;
    (async () => {
      const { data, error } = await supabase.from("profiles").select("timezone").eq("user_id", e).maybeSingle();
      if (r || error) {
        return;
      }
      const o = data?.timezone ?? null;
      if (o && isValidTimeZone(o)) {
        window.localStorage.setItem(t, "1");
        return;
      }
      const { error: error_1 } = await supabase
        .from("profiles")
        .update({
          timezone: timeZone,
        })
        .eq("user_id", e);
      if (!r && !error_1) {
        window.localStorage.setItem(t, "1");
      }
    })();
    return () => {
      r = true;
    };
  }, [e]);
}
export const LANGUAGES = [
  {
    code: "en",
    label: "English",
    native: "English",
  },
  {
    code: "ar",
    label: "Arabic",
    native: "العربية",
  },
];
export function getPreferences(e) {
  const t = e?.preferences;
  if (t && typeof t === "object" && !Array.isArray(t)) {
    return t;
  }
  return {};
}
export function getSetupState(e) {
  const setup = getPreferences(e).setup;
  if (setup && typeof setup === "object" && !Array.isArray(setup)) {
    return setup;
  }
  return {};
}
export function getLanguagePreference(e) {
  if (getPreferences(e).language === "ar") {
    return "ar";
  }
  return "en";
}
export function getConsentAt(e) {
  const consent_at = getSetupState(e).consent_at;
  if (typeof consent_at === "string" && consent_at) {
    return consent_at;
  }
  return null;
}
export function isSetupComplete(e) {
  return getSetupState(e).completed_at != null;
}
export function needsSetup(e) {
  let t;
  if (!e || isSetupComplete(e)) {
    return false;
  }
  return !((t = e.display_name) != null && t.trim());
}
export function createSetupDraft(e) {
  let t = "";
  try {
    t = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    t = "";
  }
  return {
    name: e?.display_name?.trim() ?? "",
    language: getLanguagePreference(e),
    consentAt: getConsentAt(e),
    timezone: e?.timezone?.trim() || t,
    checkinAt: "08:00",
    checkinSlot: "morning",
  };
}
export function validateSetupStep(e, t) {
  if (e === "name" && t.name.trim().length < 1) {
    return "Alma needs something to call you.";
  }
  if (e === "name" && t.name.trim().length > 60) {
    return "That name is a little long.";
  }
  if (e === "consent" && !t.consentAt) {
    return "Please agree before continuing.";
  }
  if (e === "timezone" && !t.timezone) {
    return "Pick a timezone so check-ins land at the right hour.";
  }
  if (e === "checkin" && t.checkinAt && !/^\d{2}:\d{2}$/.test(t.checkinAt)) {
    return "That isn't a valid time.";
  }
  return null;
}
export function buildSetupUpdate(e, t, n = new Date()) {
  const r = getPreferences(e);
  const s = r.whatsapp && typeof r.whatsapp === "object" ? r.whatsapp : {};
  const checkin_on = !!t.checkinAt;
  const t_checkinSlot = t.checkinSlot;
  return {
    display_name: t.name.trim(),
    timezone: t.timezone,
    preferences: {
      ...r,
      language: t.language,
      setup: {
        ...getSetupState(e),
        completed_at: n.toISOString(),
        consent_at: t.consentAt,
        consent_version: CONSENT_VERSION,
      },
      whatsapp: {
        ...s,
        checkin_on,
        ...(checkin_on
          ? {
              [`${t_checkinSlot}_at`]: t.checkinAt,
              morning_on: t_checkinSlot === "morning",
              midday_on: t_checkinSlot === "midday",
              evening_on: t_checkinSlot === "evening",
            }
          : {}),
      },
    },
  };
}
export const CONSENT_VERSION = 1;
export const CONSENT_POINTS = [
  "What you send Alma — text, photos and voice notes — is stored in your private vault so it can be found again later.",
  "Voice notes are transcribed and photos are described by AI services so they can be searched. The originals are kept as you sent them.",
  "Alma builds a picture of the people and places you mention, to answer questions about your own life. You can correct or remove any of it.",
  "Nobody else can read your vault. It is not shared with employers, and it is not used to make decisions about you.",
  "You can export everything or delete your account at any time, from Settings.",
];
export function useNeedsSetup(e) {
  const [t, setT] = React.useState(null);
  React.useEffect(() => {
    if (!e) {
      setT(null);
      return;
    }
    let r = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, timezone, phone, preferences")
        .eq("user_id", e)
        .maybeSingle();
      if (!r) {
        if (error) {
          setT(false);
          return;
        }
        setT(needsSetup(data ?? {}));
      }
    })();
    return () => {
      r = true;
    };
  }, [e]);
  return t;
}
