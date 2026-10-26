// A small PostgREST-compatible query builder over the demo store.
// Supports the subset of supabase-js the app uses: filters, ordering,
// limits, embedded relations, counts, single/maybeSingle and upserts.

import { CASCADES, RELATIONS, TABLES } from "./schema";
import { commit, table, uuid } from "./store";

const clone = (value) => (value == null ? value : JSON.parse(JSON.stringify(value)));

function splitTopLevel(input) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of input) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parseColumns(spec) {
  const fields = [];
  for (const raw of splitTopLevel(spec || "*")) {
    const match = raw.match(/^(?:(\w+):)?([\w*]+)(?:!\w+)?(?:\((.*)\))?$/s);
    if (!match) continue;
    const [, alias, name, nested] = match;
    fields.push(
      nested !== undefined ? { embed: name, alias: alias || name, columns: nested } : { name, alias: alias || name },
    );
  }
  return fields;
}

function project(tableName, row, spec) {
  const fields = parseColumns(spec);
  const out = {};
  for (const field of fields) {
    if (field.embed) {
      const rel = RELATIONS[tableName]?.[field.embed];
      if (!rel) continue;
      if (rel.many) {
        out[field.alias] = table(rel.table)
          .filter((child) => child[rel.foreign] === row.id)
          .map((child) => project(rel.table, child, field.columns));
      } else {
        const parent = table(rel.table).find((candidate) => candidate.id === row[rel.local]);
        out[field.alias] = parent ? project(rel.table, parent, field.columns) : null;
      }
    } else if (field.name === "*") {
      Object.assign(out, clone(row));
    } else {
      out[field.alias] = clone(row[field.name] ?? null);
    }
  }
  return out;
}

function likeToRegex(pattern, flags) {
  const escaped = String(pattern).replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/%/g, ".*").replace(/_/g, ".")}$`, flags);
}

function compare(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function matches(row, [op, column, value]) {
  const cell = row[column];
  switch (op) {
    case "eq":
      return cell === value || (cell != null && value != null && String(cell) === String(value));
    case "neq":
      return !(cell === value || (cell != null && String(cell) === String(value)));
    case "gt":
      return cell != null && compare(cell, value) > 0;
    case "gte":
      return cell != null && compare(cell, value) >= 0;
    case "lt":
      return cell != null && compare(cell, value) < 0;
    case "lte":
      return cell != null && compare(cell, value) <= 0;
    case "in":
      return value.some((v) => String(v) === String(cell));
    case "is":
      return value === null ? cell == null : cell === value;
    case "like":
      return cell != null && likeToRegex(value).test(String(cell));
    case "ilike":
      return cell != null && likeToRegex(value, "i").test(String(cell));
    case "contains":
      if (Array.isArray(cell)) return [].concat(value).every((v) => cell.includes(v));
      if (cell && typeof cell === "object") return Object.entries(value).every(([k, v]) => cell[k] === v);
      return false;
    case "not":
      return !matches(row, value);
    default:
      return true;
  }
}

function violatesUnique(tableName, candidate, rows, ignore) {
  for (const keys of TABLES[tableName]?.unique ?? []) {
    const caseInsensitive = keys[keys.length - 1] === "ci";
    const cols = caseInsensitive ? keys.slice(0, -1) : keys;
    const norm = (v) => (caseInsensitive && typeof v === "string" ? v.toLowerCase() : v);
    const clash = rows.find((row) => row !== ignore && cols.every((c) => norm(row[c]) === norm(candidate[c])));
    if (clash) return clash;
  }
  return null;
}

function cascadeDelete(tableName, removed) {
  for (const [child, column] of CASCADES[tableName] ?? []) {
    const ids = new Set(removed.map((row) => row.id));
    const rows = table(child);
    const gone = rows.filter((row) => ids.has(row[column]));
    if (gone.length === 0) continue;
    const keep = rows.filter((row) => !ids.has(row[column]));
    rows.length = 0;
    rows.push(...keep);
    cascadeDelete(child, gone);
  }
}

export class QueryBuilder {
  constructor(tableName, getUserId) {
    this.tableName = tableName;
    this.getUserId = getUserId;
    this.action = "select";
    this.columns = "*";
    this.filters = [];
    this.orders = [];
    this.limitCount = null;
    this.rangeFrom = null;
    this.rangeTo = null;
    this.mode = "many";
    this.countMode = null;
    this.head = false;
    this.returning = false;
    this.payload = null;
    this.options = {};
  }

  select(columns = "*", options = {}) {
    if (this.action === "select") {
      this.columns = columns;
      this.countMode = options.count ?? null;
      this.head = !!options.head;
    } else {
      this.returning = true;
      this.columns = columns;
    }
    return this;
  }

  insert(values, options = {}) {
    this.action = "insert";
    this.payload = values;
    this.options = options;
    return this;
  }

  upsert(values, options = {}) {
    this.action = "upsert";
    this.payload = values;
    this.options = options;
    return this;
  }

  update(values) {
    this.action = "update";
    this.payload = values;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column, value) {
    this.filters.push(["eq", column, value]);
    return this;
  }
  neq(column, value) {
    this.filters.push(["neq", column, value]);
    return this;
  }
  gt(column, value) {
    this.filters.push(["gt", column, value]);
    return this;
  }
  gte(column, value) {
    this.filters.push(["gte", column, value]);
    return this;
  }
  lt(column, value) {
    this.filters.push(["lt", column, value]);
    return this;
  }
  lte(column, value) {
    this.filters.push(["lte", column, value]);
    return this;
  }
  in(column, values) {
    this.filters.push(["in", column, values ?? []]);
    return this;
  }
  is(column, value) {
    this.filters.push(["is", column, value]);
    return this;
  }
  like(column, pattern) {
    this.filters.push(["like", column, pattern]);
    return this;
  }
  ilike(column, pattern) {
    this.filters.push(["ilike", column, pattern]);
    return this;
  }
  contains(column, value) {
    this.filters.push(["contains", column, value]);
    return this;
  }
  match(query) {
    for (const [column, value] of Object.entries(query)) this.eq(column, value);
    return this;
  }
  not(column, op, value) {
    this.filters.push(["not", column, [op, column, value]]);
    return this;
  }
  filter(column, op, value) {
    this.filters.push([op, column, value]);
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orders.push([column, ascending]);
    return this;
  }
  limit(count) {
    this.limitCount = count;
    return this;
  }
  range(from, to) {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }
  single() {
    this.mode = "single";
    return this;
  }
  maybeSingle() {
    this.mode = "maybe";
    return this;
  }
  abortSignal() {
    return this;
  }
  returns() {
    return this;
  }
  throwOnError() {
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve()
      .then(() => this.execute())
      .then(resolve, reject);
  }

  matching(rows) {
    // Row-level security: a signed-in user only ever sees their own rows.
    const userId = this.getUserId();
    return rows.filter(
      (row) => (!("user_id" in row) || row.user_id === userId) && this.filters.every((f) => matches(row, f)),
    );
  }

  prepareRow(values) {
    const spec = TABLES[this.tableName];
    const row = { ...(spec?.defaults?.() ?? {}), ...clone(values) };
    if (!row.id && spec?.key !== "user_id") row.id = uuid();
    if (!row.id && spec?.key === "user_id") row.id = uuid();
    const userId = this.getUserId();
    if (userId && !("user_id" in values) && this.tableName !== "memory_media") row.user_id = userId;
    return row;
  }

  execute() {
    const rows = table(this.tableName);
    let result = [];
    let count = null;

    if (this.action === "insert" || this.action === "upsert") {
      const list = Array.isArray(this.payload) ? this.payload : [this.payload];
      const conflictCols = (this.options.onConflict || TABLES[this.tableName]?.key || "id")
        .split(",")
        .map((c) => c.trim());
      for (const values of list) {
        if (this.action === "upsert") {
          const existing = rows.find((row) =>
            conflictCols.every((c) => values[c] !== undefined && row[c] === values[c]),
          );
          if (existing) {
            if (!this.options.ignoreDuplicates)
              Object.assign(existing, clone(values), { updated_at: new Date().toISOString() });
            result.push(existing);
            continue;
          }
        }
        const row = this.prepareRow(values);
        const key = TABLES[this.tableName]?.key;
        if (key && rows.some((r) => r[key] === row[key]) && this.action === "insert") {
          return this.fail({
            code: "23505",
            message: `duplicate key value violates unique constraint "${this.tableName}_${key}_key"`,
          });
        }
        if (violatesUnique(this.tableName, row, rows)) {
          return this.fail({
            code: "23505",
            message: `duplicate key value violates unique constraint on ${this.tableName}`,
          });
        }
        rows.push(row);
        result.push(row);
      }
      commit();
      if (!this.returning) return this.finish(null, null);
    } else if (this.action === "update") {
      const targets = this.matching(rows);
      for (const row of targets) {
        const next = { ...row, ...clone(this.payload) };
        if (violatesUnique(this.tableName, next, rows, row)) {
          return this.fail({
            code: "23505",
            message: `duplicate key value violates unique constraint on ${this.tableName}`,
          });
        }
        Object.assign(row, clone(this.payload));
        if ("updated_at" in row && !("updated_at" in this.payload)) row.updated_at = new Date().toISOString();
      }
      commit();
      result = targets;
      if (!this.returning) return this.finish(null, null);
    } else if (this.action === "delete") {
      const targets = this.matching(rows);
      const ids = new Set(targets);
      const keep = rows.filter((row) => !ids.has(row));
      rows.length = 0;
      rows.push(...keep);
      cascadeDelete(this.tableName, targets);
      commit();
      result = targets;
      if (!this.returning) return this.finish(null, null);
    } else {
      result = this.matching(rows);
      if (this.countMode) count = result.length;
    }

    for (const [column, ascending] of [...this.orders].reverse()) {
      result = [...result].sort((a, b) => (ascending ? 1 : -1) * compare(a[column], b[column]));
    }
    if (this.rangeFrom != null) result = result.slice(this.rangeFrom, this.rangeTo + 1);
    if (this.limitCount != null) result = result.slice(0, this.limitCount);
    if (this.head) return this.finish(null, count);

    const data = result.map((row) => project(this.tableName, row, this.columns));
    if (this.mode === "single") {
      if (data.length !== 1) {
        return this.fail({
          code: "PGRST116",
          message: "JSON object requested, multiple (or no) rows returned",
          details: `The result contains ${data.length} rows`,
        });
      }
      return this.finish(data[0], count);
    }
    if (this.mode === "maybe") {
      if (data.length > 1) return this.fail({ code: "PGRST116", message: "Multiple rows returned" });
      return this.finish(data[0] ?? null, count);
    }
    return this.finish(data, count);
  }

  finish(data, count) {
    return { data, error: null, count, status: 200, statusText: "OK" };
  }

  fail(error) {
    return {
      data: null,
      error: { details: null, hint: null, ...error },
      count: null,
      status: 400,
      statusText: "Bad Request",
    };
  }
}
