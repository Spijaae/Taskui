export const DEFAULT_MEMORY_PREFS = {
  autoTagPeople: true,
  weeklyReflection: true,
  suggestRevisits: false,
};
function asObject(e) {
  if (e && typeof e === "object" && !Array.isArray(e)) {
    return e;
  }
  return {};
}
export function readMemoryPrefs(e) {
  const t = asObject(asObject(e).memory);
  return {
    autoTagPeople: typeof t.autoTagPeople === "boolean" ? t.autoTagPeople : DEFAULT_MEMORY_PREFS.autoTagPeople,
    weeklyReflection:
      typeof t.weeklyReflection === "boolean" ? t.weeklyReflection : DEFAULT_MEMORY_PREFS.weeklyReflection,
    suggestRevisits: typeof t.suggestRevisits === "boolean" ? t.suggestRevisits : DEFAULT_MEMORY_PREFS.suggestRevisits,
  };
}
export function writeMemoryPrefs(e, t) {
  return {
    ...asObject(e),
    memory: {
      ...t,
    },
  };
}
export function memberSince(e) {
  if (!e) {
    return "";
  }
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) {
    return "";
  }
  return `member since ${t.toLocaleDateString(undefined, {
    month: "short",
  })} ${t.getFullYear()}`;
}
export function timezoneLabel(timeZone, t = new Date()) {
  if (!timeZone) {
    return "";
  }
  try {
    const s = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(t)
      .find((c) => c.type === "timeZoneName")?.value;
    if (s) {
      return `${timeZone} · ${s}`;
    }
    return timeZone;
  } catch {
    return timeZone;
  }
}
export function exportFileName(e = new Date()) {
  return `alma-export-${`${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`}.json`;
}
const CHECKIN_SLOTS = ["morning", "midday", "evening"];
function minutesOf(e) {
  const [t, n] = String(e ?? "")
    .split(":")
    .map(Number);
  return (Number.isFinite(t) ? t : 0) * 60 + (Number.isFinite(n) ? n : 0);
}
export function activeCheckinSlot(e) {
  const t = CHECKIN_SLOTS.filter((n) => e[`${n}_on`] !== false);
  if (t.length) {
    return t.reduce((acc, item) => {
      if (minutesOf(e[`${item}_at`]) < minutesOf(e[`${acc}_at`])) {
        return item;
      }
      return acc;
    });
  }
  return "morning";
}
export function slotFlags(e) {
  return {
    morning_on: e === "morning",
    midday_on: e === "midday",
    evening_on: e === "evening",
  };
}
export const iconClock =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/clock'%3e%3cpath%20id='Vector'%20d='M7.5%2013.125C10.6066%2013.125%2013.125%2010.6066%2013.125%207.5C13.125%204.3934%2010.6066%201.875%207.5%201.875C4.3934%201.875%201.875%204.3934%201.875%207.5C1.875%2010.6066%204.3934%2013.125%207.5%2013.125Z'%20stroke='%2317324d'%20stroke-opacity='0.45'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M7.5%204.375V7.5L9.375%208.75'%20stroke='%2317324d'%20stroke-opacity='0.45'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
