const RETURN_TO_KEY = "alma.returnTo";
const MAX_RETURN_TO_LENGTH = 512;
function hasControlChars(e) {
  for (const t of e) {
    const n = t.codePointAt(0);
    if (n <= 31 || n === 127 || /\s/.test(t)) {
      return true;
    }
  }
  return false;
}
export function sanitizeReturnTo(e) {
  if (typeof e !== "string") {
    return null;
  }
  const t = e.trim();
  if (
    !t ||
    t.length > MAX_RETURN_TO_LENGTH ||
    !t.startsWith("/") ||
    t.startsWith("//") ||
    t.startsWith("/\\") ||
    t.includes("\\") ||
    hasControlChars(t)
  ) {
    return null;
  }
  const n = t.split(/[?#]/)[0];
  if (n === "/auth" || n.startsWith("/auth/")) {
    return null;
  }
  return t;
}
export function rememberReturnTo(e) {
  const t = sanitizeReturnTo(e);
  try {
    if (t) {
      sessionStorage.setItem(RETURN_TO_KEY, t);
    } else {
      sessionStorage.removeItem(RETURN_TO_KEY);
    }
  } catch {}
}
export function consumeReturnTo() {
  try {
    const e = sessionStorage.getItem(RETURN_TO_KEY);
    sessionStorage.removeItem(RETURN_TO_KEY);
    return sanitizeReturnTo(e);
  } catch {
    return null;
  }
}
export function returnToFromLocation(e) {
  if (e != null && e.pathname) {
    return sanitizeReturnTo(`${e.pathname}${e.search ?? ""}${e.hash ?? ""}`);
  }
  return null;
}
