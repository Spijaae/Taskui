export const DEFAULT_CONVERSATION_TITLE = "New Conversation";
export function conversationTitle(e) {
  const t = e.title?.trim();
  if (t && t.length > 0) {
    return t;
  }
  return DEFAULT_CONVERSATION_TITLE;
}
const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function dayStart(e) {
  return new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
}
export function conversationDayLabel(e, t) {
  const n = new Date(e);
  if (Number.isNaN(n.getTime())) {
    return "";
  }
  const r = Math.round((dayStart(t) - dayStart(n)) / 86400000);
  if (r <= 0) {
    return "TODAY";
  }
  if (r === 1) {
    return "YESTERDAY";
  }
  const s = `${n.getDate()} ${MONTH_ABBR[n.getMonth()]}`;
  if (n.getFullYear() === t.getFullYear()) {
    return s;
  }
  return `${s} ${n.getFullYear()}`;
}
export function filterConversations(e, t) {
  const n = t.trim().toLowerCase();
  if (n === "") {
    return e;
  }
  return e.filter((r) => conversationTitle(r).toLowerCase().includes(n));
}
