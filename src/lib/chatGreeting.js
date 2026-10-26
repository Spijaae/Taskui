const WA_EMAIL_PATTERN = /^wa\+\d+@/i;
function capitalize(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
export function greetingName(t, e) {
  const o = t?.trim();
  if (o) {
    const n = o.split(/\s+/)[0];
    if (n && !n.includes("@")) {
      return n;
    }
  }
  const r = e?.trim();
  if (!r || WA_EMAIL_PATTERN.test(r)) {
    return "";
  }
  const s = r.split("@")[0].split(/[._-]/).filter(Boolean)[0];
  if (s) {
    return capitalize(s);
  }
  return "";
}
export const QUICK_PROMPTS = [
  {
    label: "Journal",
    prompt: "Today I ",
  },
  {
    label: "Remember",
    prompt: "Remember that ",
  },
  {
    label: "Schedule",
    prompt: "Remind me to ",
  },
  {
    label: "Reflect",
    prompt: "Help me reflect on ",
  },
];
