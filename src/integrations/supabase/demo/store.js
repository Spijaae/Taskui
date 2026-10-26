// Browser-local data store used when no Supabase project is configured.
// Tables live in localStorage so a demo account survives reloads.

const DB_KEY = "alma-demo:db";

const listeners = new Set();
let cache = null;

function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(DB_KEY) || "null");
  } catch {
    cache = null;
  }
  if (!cache || typeof cache !== "object") cache = { tables: {} };
  cache.tables = cache.tables || {};
  return cache;
}

function persist() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn("[demo] could not persist data", error);
  }
  listeners.forEach((fn) => fn());
}

export function table(name) {
  const db = load();
  if (!db.tables[name]) db.tables[name] = [];
  return db.tables[name];
}

export function setTable(name, rows) {
  load().tables[name] = rows;
  persist();
}

export function commit() {
  persist();
}

export function getMeta(key) {
  return load()[key];
}

export function setMeta(key, value) {
  load()[key] = value;
  persist();
}

export function resetStore() {
  cache = { tables: {} };
  persist();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
