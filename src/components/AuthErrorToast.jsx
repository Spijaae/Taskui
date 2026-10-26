import React from "react";
import { toast } from "sonner";

const OAUTH_ERROR_MESSAGES = {
  access_denied: "Sign-in was cancelled.",
  server_error: "The sign-in provider had a problem. Please try again.",
  temporarily_unavailable: "The sign-in provider is unavailable. Please try again.",
  otp_expired: "That link has expired. Please sign in again.",
};
function describeAuthError(code, t) {
  if (OAUTH_ERROR_MESSAGES[code]) {
    return OAUTH_ERROR_MESSAGES[code];
  }
  const n = t == null ? undefined : t.replace(/\+/g, " ").trim();
  if (n && n.length > 0) {
    return n;
  }
  return "Sign-in failed. Please try again.";
}
function readAuthError(search, hash) {
  for (const n of [search, hash]) {
    const r = new URLSearchParams(n.replace(/^[?#]/, ""));
    const code = r.get("error") ?? r.get("error_code");
    if (code) {
      return {
        code,
        message: describeAuthError(code, r.get("error_description")),
      };
    }
  }
  return null;
}
const AUTH_ERROR_PARAMS = ["error", "error_code", "error_description"];
function stripAuthError(href) {
  const t = new URL(href);
  for (const n of AUTH_ERROR_PARAMS) {
    t.searchParams.delete(n);
  }
  if (t.hash.length > 1) {
    const n = new URLSearchParams(t.hash.slice(1));
    if (AUTH_ERROR_PARAMS.some((r) => n.has(r))) {
      for (const s of AUTH_ERROR_PARAMS) {
        n.delete(s);
      }
      const r = n.toString();
      t.hash = r ? `#${r}` : "";
    }
  }
  return t.toString();
}
export default function AuthErrorToast() {
  React.useEffect(() => {
    const e = readAuthError(window.location.search, window.location.hash);
    if (e) {
      toast.error(e.message);
      window.history.replaceState({}, "", stripAuthError(window.location.href));
    }
  }, []);
  return null;
}
