import React from "react";
import { ar } from "./ar";
import { en } from "./en";
import { supabase } from "@/integrations/supabase/client";

export function dirFor(e) {
  if (e === "ar") {
    return "rtl";
  }
  return "ltr";
}
export function localeFor(e) {
  if (e === "ar") {
    return "ar-u-nu-latn";
  }
  return "en-GB";
}
const dictionaries = {
  en: en,
  ar: ar,
};
export function translate(e, t, n = {}) {
  return (dictionaries[e]?.[t] ?? en[t] ?? t).replace(/\{(\w+)\}/g, (i, o) => {
    const a = n[o];
    if (a === undefined) {
      return i;
    }
    return String(a);
  });
}
const I18nContext = React.createContext({
  language: "en",
  dir: "ltr",
  locale: localeFor("en"),
  t: (e, t) => translate("en", e, t),
  setLanguage: () => {},
});
export function useI18n() {
  return React.useContext(I18nContext);
}
const LANGUAGE_KEY = "alma:language";
function readStoredLanguage() {
  try {
    if (localStorage.getItem(LANGUAGE_KEY) === "ar") {
      return "ar";
    }
    return "en";
  } catch {
    return "en";
  }
}
export function LanguageProvider({ children }) {
  const [t, setT] = React.useState(readStoredLanguage);
  React.useEffect(() => {
    let o = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || o) {
        return;
      }
      const { data } = await supabase.from("profiles").select("preferences").eq("user_id", user.id).maybeSingle();
      if (o) {
        return;
      }
      const c = data?.preferences?.language;
      setT(c === "ar" ? "ar" : "en");
    })();
    return () => {
      o = true;
    };
  }, []);
  const dir = dirFor(t);
  React.useEffect(() => {
    const document_documentElement = document.documentElement;
    document_documentElement.setAttribute("dir", dir);
    document_documentElement.setAttribute("lang", t);
    try {
      localStorage.setItem(LANGUAGE_KEY, t);
    } catch {}
  }, [dir, t]);
  const setLanguage = React.useCallback((o) => setT(o), []);
  const i = React.useMemo(
    () => ({
      language: t,
      dir,
      locale: localeFor(t),
      t: (o, a) => translate(t, o, a),
      setLanguage,
    }),
    [dir, t, setLanguage],
  );
  return <I18nContext.Provider value={i}>{children}</I18nContext.Provider>;
}
