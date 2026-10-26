import { X as XIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileTopBar } from "@/components/MobileTopBar";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconBack, iconRefresh } from "@/lib/appIcons";
import { iconSpark } from "@/lib/icons";
import { cn } from "@/lib/utils";

function I(e, r) {
  const s = e ?? [];
  if (!s.length) {
    return [];
  }
  const o = s.find((a) => a.canonical_key === "self")?.id ?? null;
  const n = new Map(s.map((a) => [a.id, a.id === o ? "you" : a.name]));
  const l = new Map();
  for (const a of r ?? []) {
    const m = a.object_entity_id
      ? (n.get(a.object_entity_id) ?? a.object_text ?? "")
      : a.object_text === "self"
        ? "you"
        : (a.object_text ?? "");
    const label = `${String(a.predicate ?? "").replace(/_/g, " ")} ${m}`.trim();
    if (!label) {
      continue;
    }
    const b = l.get(a.subject_entity_id) ?? [];
    b.push({
      id: a.id,
      label,
    });
    l.set(a.subject_entity_id, b);
  }
  return s
    .map((a) => ({
      id: a.id,
      name: a.id === o ? "You" : a.name,
      kind: a.kind,
      summary: a.summary,
      salience: Number(a.salience ?? 0),
      mentionCount: Number(a.mention_count ?? 0),
      facts: l.get(a.id) ?? [],
      isSelf: a.id === o,
    }))
    .sort((a, m) => {
      if (a.id === o) {
        return -1;
      }
      if (m.id === o) {
        return 1;
      }
      return m.salience - a.salience;
    });
}
const P = {
  person: ["person", "people"],
  place: ["place", "places"],
  organisation: ["organisation", "organisations"],
  organization: ["organisation", "organisations"],
  event: ["event", "events"],
  topic: ["topic", "topics"],
  thing: ["thing", "things"],
};
function N(e, r) {
  const s = P[e?.toLowerCase?.() ?? ""];
  if (s) {
    if (r === 1) {
      return s[0];
    }
    return s[1];
  }
  const o = String(e ?? "other").replace(/_/g, " ");
  if (r === 1) {
    return o;
  }
  return `${o}s`;
}
const y = ["person", "place", "organisation", "event", "topic", "thing"];
function F(e) {
  const r = e ?? [];
  const s = new Map();
  let facts = 0;
  for (const n of r) {
    facts += n.facts.length;
    if (n.isSelf) {
      continue;
    }
    const l = (n.kind || "other").toLowerCase();
    s.set(l, (s.get(l) ?? 0) + 1);
  }
  return {
    entities: r.length,
    facts,
    kinds: [...s.entries()]
      .map(([n, l]) => ({
        kind: n,
        label: N(n, l),
        count: l,
      }))
      .sort((n, l) => {
        if (l.count !== n.count) {
          return l.count - n.count;
        }
        const c = y.indexOf(n.kind);
        const a = y.indexOf(l.kind);
        if (c !== a) {
          return (c < 0 ? y.length : c) - (a < 0 ? y.length : a);
        }
        return n.kind.localeCompare(l.kind);
      }),
  };
}
function K(e) {
  if (e.length <= 1) {
    return e[0] ?? "";
  }
  return `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`;
}
function B(e) {
  if (e.entities === 0) {
    return "Nothing yet — Alma learns as you talk.";
  }
  const r = K(e.kinds.map((o) => `${o.count} ${o.label}`));
  const s = `${e.facts} ${e.facts === 1 ? "detail" : "details"}`;
  if (r) {
    if (e.facts === 0) {
      return `Alma has noted ${r}, with no details attached yet.`;
    }
    return `Alma is holding ${s} across ${r}.`;
  }
  if (e.facts === 0) {
    return "Alma has started a picture of you, with no details attached yet.";
  }
  return `Alma is holding ${s} about you.`;
}
export default function Profile() {
  const { t } = useI18n();
  const r = useNavigate();
  const [s, setS] = React.useState([]);
  const [n, setN] = React.useState(true);
  const [c, setC] = React.useState("all");
  const m = React.useCallback(async () => {
    setN(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t("profile.err.login"));
        setN(false);
        return;
      }
      const [{ data }, { data: data_1 }] = await Promise.all([
        supabase
          .from("context_entities")
          .select("id, name, canonical_key, kind, summary, salience, mention_count")
          .eq("user_id", user.id)
          .eq("status", "active"),
        supabase
          .from("context_facts")
          .select("id, subject_entity_id, predicate, object_text, object_entity_id")
          .eq("user_id", user.id)
          .eq("status", "active"),
      ]);
      setS(I(data ?? [], data_1 ?? []));
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error(t("profile.err.load"));
    } finally {
      setN(false);
    }
  }, [t]);
  React.useEffect(() => {
    m();
  }, [m]);
  const d = React.useMemo(() => F(s), [s]);
  const b = React.useMemo(() => B(d), [d]);
  React.useEffect(() => {
    if (c !== "all" && !d.kinds.some((i) => i.kind === c)) {
      setC("all");
    }
  }, [c, d.kinds]);
  const w = React.useMemo(() => {
    if (c === "all") {
      return s;
    }
    return s.filter((i) => (i.kind || "other").toLowerCase() === c);
  }, [s, c]);
  const onForgetFact = async (i) => {
    const { error } = await supabase
      .from("context_facts")
      .update({
        status: "retracted",
      })
      .eq("id", i);
    if (error) {
      console.error("Retract failed:", error);
      toast.error(t("profile.err.remove"));
      return;
    }
    setS((p) =>
      p.map((h) => ({
        ...h,
        facts: h.facts.filter(($) => $.id !== i),
      })),
    );
    toast.success(t("profile.ok.forgotten"));
  };
  const onForgetEntity = async (i) => {
    const { error } = await supabase
      .from("context_entities")
      .update({
        status: "retracted",
      })
      .eq("id", i);
    if (error) {
      console.error("Retract failed:", error);
      toast.error(t("profile.err.remove"));
      return;
    }
    setS((p) => p.filter((h) => h.id !== i));
    toast.success(t("profile.ok.forgotten"));
  };
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileTopBar
          title={t("nav.profile")}
          leading={{
            icon: iconBack,
            label: t("action.back"),
            onClick: () => r(-1),
          }}
        />
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 px-4 sm:px-[30px] pb-6 pt-[38px]">
          <div className="flex flex-col gap-3">
            <p className="font-body text-sm tracking-[0.14px] text-alma-muted">{t("profile.yours")}</p>
            <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">
              {t("profile.heading")}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void m()}
            disabled={n}
            className="flex items-center gap-2.5 rounded-[24px] border border-dashed border-[rgba(23,50,77,0.35)] px-6 py-2.5 font-body text-base tracking-[0.16px] text-[rgba(23,50,77,0.7)] transition-colors hover:bg-alma-soft disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
          >
            <img src={iconRefresh} alt="" className="h-4 w-4" />
            {n ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="flex flex-col gap-6 px-4 sm:px-[30px] pb-10">
          <section className="rounded-[12px] border border-alma-line bg-gradient-to-r from-alma-soft to-white to-[70%] px-6 py-6">
            <h2 className="max-w-4xl font-display text-[28px] font-semibold leading-tight tracking-[0.28px] text-alma-ink">
              {b}
            </h2>
            <p className="mt-4 max-w-2xl font-body text-base leading-[26px] tracking-[0.16px] text-alma-muted">
              Built up from your own conversations. Remove anything that's wrong — Alma won't learn it again.
            </p>
          </section>
          {d.kinds.length > 1 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <VComponent label="All" count={s.length} active={c === "all"} onClick={() => setC("all")} />
              {d.kinds.map((i) => (
                <VComponent
                  key={i.kind}
                  label={i.label}
                  count={i.count}
                  active={c === i.kind}
                  onClick={() => setC(i.kind)}
                />
              ))}
            </div>
          )}
          {n && s.length === 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {[0, 1, 2, 3].map((key) => (
                <div key={key} className="h-[168px] animate-pulse rounded-[12px] border border-alma-line bg-white" />
              ))}
            </div>
          ) : s.length === 0 ? (
            <section className="flex flex-col items-center gap-3 rounded-[12px] border border-alma-line bg-white px-6 py-16 text-center">
              <img src={iconSpark} alt="" className="h-10 w-10 opacity-70" />
              <p className="font-display text-lg font-semibold tracking-[0.18px] text-alma-ink">
                Nothing yet — I learn as we talk.
              </p>
              <p className="max-w-sm font-body text-sm leading-6 tracking-[0.14px] text-alma-muted">
                {t("profile.emptyHint")}
              </p>
            </section>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {w.map((entity) => (
                <DComponent
                  key={entity.id}
                  entity={entity}
                  onForgetFact={onForgetFact}
                  onForgetEntity={onForgetEntity}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function VComponent({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2 rounded-[24px] border px-4 py-2 font-body text-sm tracking-[0.14px] transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
        active
          ? "border-transparent bg-alma-panel text-alma-ink"
          : "border-alma-line bg-white text-alma-muted hover:bg-alma-soft",
      )}
    >
      <span className="capitalize">{label}</span>
      <span className={cn("font-medium", active ? "text-alma-ink/70" : "text-alma-ink/45")}>{count}</span>
    </button>
  );
}
function DComponent({ entity, onForgetFact, onForgetEntity }) {
  const { t } = useI18n();
  return (
    <article className="flex flex-col rounded-[12px] border border-alma-line bg-white p-5">
      <header className="flex flex-wrap items-center gap-2.5">
        <h3 className="font-display text-lg font-semibold tracking-[0.18px] text-alma-ink">{entity.name}</h3>
        <span className="rounded-full bg-alma-soft px-2.5 py-1 font-body text-[11.5px] capitalize tracking-[0.23px] text-[rgba(23,50,77,0.65)]">
          {entity.isSelf ? "you" : N(entity.kind, 1)}
        </span>
        {entity.mentionCount > 0 && (
          <span className="font-body text-[11.5px] tracking-[0.23px] text-alma-muted">
            mentioned {entity.mentionCount}×
          </span>
        )}
        <button
          type="button"
          onClick={() => onForgetEntity(entity.id)}
          className="ms-auto rounded-full px-3 py-1.5 font-body text-xs tracking-[0.24px] text-alma-muted transition-colors hover:bg-[#fdf1f0] hover:text-[#b3261e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
        >
          {t("profile.forgetEntirely")}
        </button>
      </header>
      {entity.summary && (
        <p className="mt-3 font-body text-sm leading-6 tracking-[0.14px] text-alma-ink">{entity.summary}</p>
      )}
      {entity.facts.length === 0 ? (
        <p className="mt-3 font-body text-xs tracking-[0.24px] text-alma-muted">{t("profile.noDetails")}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1">
          {entity.facts.map((n) => (
            <li
              key={n.id}
              className="group flex items-center gap-2.5 rounded-[8px] px-2 py-1.5 transition-colors hover:bg-alma-soft"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-alma-action" />
              <span className="flex-1 font-body text-sm leading-6 tracking-[0.14px] text-alma-ink">{n.label}</span>
              <button
                type="button"
                onClick={() => onForgetFact(n.id)}
                aria-label={`Forget: ${n.label}`}
                className="rounded-full p-1 text-alma-muted opacity-0 transition-opacity hover:bg-[#fdf1f0] hover:text-[#b3261e] focus:opacity-100 group-hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
