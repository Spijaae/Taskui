import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  iconVault,
  iconOrbit,
  iconMic,
  iconNote,
  iconSearch,
  iconSpark12,
  iconSpark,
  iconReturn,
  iconUpDown,
} from "@/lib/icons";
import { splitTitle, rankMemories, matchPeople, summarizeResults, memoryMeta } from "@/lib/memories";
import { fadeQuick, springPop } from "@/lib/motion";
import { cn } from "@/lib/utils";

const KBD_CLASS =
  "rounded-[6px] border border-[rgba(23,50,77,0.12)] bg-[#eaf3fa] px-[7px] py-1 font-body text-[10.5px] font-medium text-[rgba(23,50,77,0.6)]";
function SearchPalette({ open, onClose }) {
  const { t: t_1 } = useI18n();
  const r = useNavigate();
  const sRef = React.useRef(null);
  const [i, setI] = React.useState("");
  const [a, setA] = React.useState(0);
  const [c, setC] = React.useState([]);
  const [h, setH] = React.useState([]);
  const [p, setP] = React.useState(false);
  const [m, setM] = React.useState(0);
  const x = React.useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setP(true);
      try {
        const [T, P, I] = await Promise.all([
          supabase
            .from("memories")
            .select("id, content, tags, type, timestamp, created_at, metadata")
            .eq("user_id", user.id)
            .order("timestamp", {
              ascending: false,
            })
            .limit(500),
          supabase
            .from("context_entities")
            .select("id, name, aliases, kind, first_seen, mention_count, merged_into")
            .eq("user_id", user.id),
          supabase.from("context_mentions").select("memory_id, entity_id").eq("user_id", user.id),
        ]);
        const R = P.data ?? [];
        const z = new Map(R.map((M) => [M.id, M]));
        const D = new Map();
        const q = new Map();
        for (const M of I.data ?? []) {
          const _ = z.get(M.entity_id);
          if (!_ || !M.memory_id) {
            continue;
          }
          const j = D.get(M.memory_id) ?? [];
          j.push(_.name, ...(_.aliases ?? []));
          D.set(M.memory_id, j);
          if (_.kind === "place" && !q.has(M.memory_id)) {
            q.set(M.memory_id, _.name);
          }
        }
        const K = T.data ?? [];
        setM(K.length);
        setC(
          K.map((M) => {
            const M_metadata = M.metadata;
            const j = (M_metadata?.attachments ?? []).find((X) => X?.type?.startsWith("image/"));
            const kind = M.type === "voice" || M.type === "audio" ? "voice" : j ? "photo" : "note";
            const { title, body } = splitTitle(M.content);
            return {
              id: M.id,
              title,
              content: body || M.content || "",
              tags: M.tags ?? [],
              kind,
              takenAt: M.timestamp ?? M.created_at ?? new Date().toISOString(),
              thumbnailUrl: j?.url,
              entityNames: D.get(M.id) ?? [],
              place: q.get(M.id),
            };
          }),
        );
        setH(
          R.filter((M) => M.kind === "person" && !M.merged_into).map((M) => ({
            id: M.id,
            name: M.name,
            aliases: M.aliases ?? [],
            memoryCount: M.mention_count ?? 0,
            firstSeen: M.first_seen ?? null,
          })),
        );
      } finally {
        setP(false);
      }
    }
  }, []);
  React.useEffect(() => {
    if (open) {
      setI("");
      setA(0);
      x();
      window.setTimeout(() => sRef.current?.focus(), 30);
    }
  }, [open, x]);
  const g = React.useMemo(() => rankMemories(c, i), [c, i]);
  const w = React.useMemo(() => matchPeople(h, i), [h, i]);
  const k = React.useMemo(() => summarizeResults(g, w), [g, w]);
  const S = React.useMemo(() => {
    if (i.trim() === "") {
      return [];
    }
    const E = [
      {
        type: "jump",
        id: "jump-vault",
        label: "Search all your memories",
        hint: w[0] ? `including everything about ${w[0].name}` : "photos, voice notes and text",
        icon: iconVault,
        to: `/memories?q=${encodeURIComponent(i.trim())}`,
      },
      {
        type: "jump",
        id: "jump-orbit",
        label: "Gallery · Orbit",
        hint: g.length > 0 ? `see these ${g.length} in the 3D view` : "the 3D view",
        icon: iconOrbit,
        to: "/gallery",
      },
    ];
    return [
      ...g.map((T) => ({
        type: "memory",
        id: T.memory.id,
        memory: T.memory,
      })),
      ...w.map((person) => ({
        type: "person",
        id: person.id,
        person,
      })),
      ...E,
    ];
  }, [g, w, i]);
  const A = React.useCallback(
    (E) => {
      onClose();
      if (E.type === "jump") {
        r(E.to);
      } else if (E.type === "person") {
        r("/profile");
      } else {
        r(`/memories/${E.id}`);
      }
    },
    [r, onClose],
  );
  React.useEffect(() => {
    if (!open) {
      return;
    }
    const E = (T) => {
      if (T.key === "Escape") {
        onClose();
        return;
      }
      if (S.length !== 0) {
        if (T.key === "ArrowDown") {
          T.preventDefault();
          setA((P) => (P + 1) % S.length);
        }
        if (T.key === "ArrowUp") {
          T.preventDefault();
          setA((P) => (P - 1 + S.length) % S.length);
        }
        if (T.key === "Enter") {
          T.preventDefault();
          A(S[Math.min(a, S.length - 1)]);
        }
      }
    };
    window.addEventListener("keydown", E);
    return () => window.removeEventListener("keydown", E);
  }, [open, S, a, A, onClose]);
  React.useEffect(() => setA(0), [i]);
  const C = (memory) => {
    if (memory.kind === "voice") {
      return iconMic;
    }
    if (memory.kind === "note") {
      return iconNote;
    }
    return null;
  };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center sm:px-4 sm:pt-[12vh]">
          <motion.button
            type="button"
            aria-label={t_1("nav.closeSearch")}
            onClick={onClose}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={fadeQuick}
            className="absolute inset-0 cursor-default bg-gradient-to-b from-[rgba(234,243,250,0.62)] to-[rgba(234,243,250,0.78)] backdrop-blur-[5.5px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t_1("memories.search")}
            initial={{
              opacity: 0,
              scale: 0.94,
              y: -14,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: -8,
            }}
            transition={springPop}
            className="relative flex h-full max-h-none w-full flex-col overflow-hidden border-0 bg-white/[0.99] sm:h-auto sm:max-h-[70vh] sm:w-[min(640px,100%)] sm:rounded-[22px] sm:border sm:border-[rgba(23,50,77,0.12)] sm:shadow-[0px_24px_64px_0px_rgba(23,50,77,0.2)]"
          >
            <div className="flex shrink-0 items-center gap-3 py-5 ps-[22px] pe-[18px]">
              <img src={iconSearch} alt="" className="h-[21px] w-[21px] shrink-0" />
              <input
                ref={sRef}
                value={i}
                onChange={(E) => setI(E.target.value)}
                placeholder={t_1("search.placeholder")}
                aria-label={t_1("nav.search")}
                className="min-w-0 flex-1 bg-transparent font-body text-[17px] tracking-[0.17px] text-[rgba(23,50,77,0.95)] outline-none placeholder:text-[rgba(23,50,77,0.4)]"
              />
              {k && (
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[rgba(40,94,133,0.14)] bg-[#eaf3fa] py-1.5 ps-[9px] pe-[11px] sm:flex">
                  <img src={iconSpark12} alt="" className="h-3 w-3" />
                  <span className="font-body text-[11px] font-medium tracking-[0.22px] text-[rgba(23,50,77,0.9)]">
                    {t_1("search.meaning")}
                  </span>
                </span>
              )}
              <span className={cn(KBD_CLASS, "shrink-0")}>esc</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {k && (
                <>
                  <div className="px-[22px] pb-3">
                    <p className="pb-2 font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.42)]">
                      {t_1("search.readThatAs")}
                    </p>
                    <div className="flex items-start gap-[11px] rounded-[13px] border border-[rgba(40,94,133,0.16)] bg-[#eaf3fa] px-[13px] py-3">
                      <img src={iconSpark} alt="" className="mt-0.5 h-[15px] w-[15px] shrink-0" />
                      <p className="font-body text-[12.5px] leading-[19px] tracking-[0.125px] text-[rgba(23,50,77,0.88)]">
                        {k}
                      </p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-[rgba(23,50,77,0.09)]" />
                </>
              )}
              {i.trim() === "" ? (
                <p className="px-[22px] py-10 text-center font-body text-sm text-[rgba(23,50,77,0.45)]">
                  {p ? "Gathering your memories…" : "Start typing to search."}
                </p>
              ) : S.length === 0 ? (
                <p className="px-[22px] py-10 text-center font-body text-sm text-[rgba(23,50,77,0.45)]">
                  Nothing matches “{i}”.
                </p>
              ) : (
                <>
                  {g.length > 0 && (
                    <ResultGroup label={`MEMORIES · ${g.length}`}>
                      {g.map((E) => {
                        const T = S.findIndex((R) => R.id === E.memory.id);
                        const P = T === a;
                        const I = C(E.memory);
                        return (
                          <button
                            key={E.memory.id}
                            type="button"
                            onMouseEnter={() => setA(T)}
                            onClick={() => A(S[T])}
                            className={cn(
                              "flex w-full items-center gap-[13px] rounded-[13px] border py-[9px] ps-2 pe-3 text-start transition-colors",
                              P
                                ? "border-[rgba(40,94,133,0.18)] bg-[#eaf3fa]"
                                : "border-transparent hover:bg-[rgba(200,225,242,0.12)]",
                            )}
                          >
                            {E.memory.thumbnailUrl ? (
                              <img
                                src={E.memory.thumbnailUrl}
                                alt=""
                                className="size-10 shrink-0 rounded-[10px] object-cover"
                              />
                            ) : (
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa]">
                                {I && <img src={I} alt="" className="h-4 w-4" />}
                              </span>
                            )}
                            <span className="flex min-w-0 flex-1 flex-col gap-1">
                              <span className="truncate font-body text-[13.5px] font-medium tracking-[0.135px] text-[rgba(23,50,77,0.95)]">
                                {E.memory.title}
                              </span>
                              <span className="truncate font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.5)]">
                                {memoryMeta(E.memory)}
                              </span>
                            </span>
                            <span className="hidden shrink-0 rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] px-[9px] py-[5px] font-body text-[10.5px] font-medium tracking-[0.21px] text-[rgba(23,50,77,0.6)] sm:block">
                              {E.memory.kind === "voice" ? "Voice" : E.memory.kind === "note" ? "Note" : "Photo"}
                            </span>
                            {P && (
                              <span className={cn(KBD_CLASS, "hidden shrink-0 sm:block")}>
                                <img src={iconReturn} alt="↵" className="h-3 w-3" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </ResultGroup>
                  )}
                  {w.length > 0 && (
                    <ResultGroup label={`PEOPLE · ${w.length}`}>
                      {w.map((E) => {
                        const T = S.findIndex((I) => I.id === E.id);
                        const P = T === a;
                        return (
                          <button
                            key={E.id}
                            type="button"
                            onMouseEnter={() => setA(T)}
                            onClick={() => A(S[T])}
                            className={cn(
                              "flex w-full items-center gap-[13px] rounded-[13px] border py-[9px] ps-2 pe-3 text-start transition-colors",
                              P
                                ? "border-[rgba(40,94,133,0.18)] bg-[#eaf3fa]"
                                : "border-transparent hover:bg-[rgba(200,225,242,0.12)]",
                            )}
                          >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dcefff] font-body text-base font-semibold text-[#2f6fb0]">
                              {E.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-1">
                              <span className="truncate font-body text-[13.5px] font-medium tracking-[0.135px] text-[rgba(23,50,77,0.95)]">
                                {E.name}
                              </span>
                              <span className="truncate font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.5)]">
                                {E.memoryCount} {E.memoryCount === 1 ? "mention" : "mentions"}
                                {E.firstSeen
                                  ? ` · first seen ${new Date(E.firstSeen).toLocaleDateString(undefined, {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}`
                                  : ""}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </ResultGroup>
                  )}
                  <ResultGroup label={t_1("search.jumpTo")}>
                    {S.filter((E) => E.type === "jump").map((E) => {
                      const T = S.findIndex((I) => I.id === E.id);
                      const P = T === a;
                      return (
                        <button
                          key={E.id}
                          type="button"
                          onMouseEnter={() => setA(T)}
                          onClick={() => A(E)}
                          className={cn(
                            "flex w-full items-center gap-[13px] rounded-[13px] border py-2 ps-2 pe-3 text-start transition-colors",
                            P
                              ? "border-[rgba(40,94,133,0.18)] bg-[#eaf3fa]"
                              : "border-transparent hover:bg-[rgba(200,225,242,0.12)]",
                          )}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa]">
                            <img src={E.icon} alt="" className="h-[17px] w-[17px]" />
                          </span>
                          <span className="flex min-w-0 flex-1 items-center gap-2.5">
                            <span className="shrink-0 font-body text-[13px] font-medium tracking-[0.13px] text-[rgba(23,50,77,0.9)]">
                              {E.label}
                            </span>
                            <span className="truncate font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.45)]">
                              {E.hint}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </ResultGroup>
                </>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-4 border-t border-[rgba(23,50,77,0.09)] px-[22px] py-3">
              <span className="flex items-center gap-2">
                <img src={iconUpDown} alt="" className="h-3.5 w-3.5" />
                <span className="font-body text-[11.5px] text-[rgba(23,50,77,0.5)]">navigate</span>
              </span>
              <span className="flex items-center gap-2">
                <img src={iconReturn} alt="" className="h-3.5 w-3.5" />
                <span className="font-body text-[11.5px] text-[rgba(23,50,77,0.5)]">open</span>
              </span>
              <span className="flex-1" />
              <span className="font-body text-[11.5px] text-[rgba(23,50,77,0.45)]">
                Searching {m.toLocaleString()} {m === 1 ? "memory" : "memories"}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
function ResultGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3.5">
      <p className="ps-2 font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.42)]">{label}</p>
      {children}
    </div>
  );
}
function isTypingTarget(target) {
  if (target instanceof HTMLElement) {
    if (target.isContentEditable) {
      return false;
    }
    return !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  }
  return true;
}
const SearchPaletteContext = React.createContext(null);
export function useSearchPalette() {
  return (
    React.useContext(SearchPaletteContext) ?? {
      open: () => {},
      close: () => {},
      isOpen: false,
    }
  );
}
export function SearchPaletteProvider({ children }) {
  const [t, setT] = React.useState(false);
  const r = React.useCallback(() => setT(true), []);
  const s = React.useCallback(() => setT(false), []);
  React.useEffect(() => {
    const o = (a) => {
      if ((a.metaKey || a.ctrlKey) && a.key.toLowerCase() === "k") {
        a.preventDefault();
        setT((l) => !l);
        return;
      }
      if (a.key === "/" && !a.metaKey && !a.ctrlKey && !a.altKey) {
        if (!isTypingTarget(a.target)) {
          return;
        }
        a.preventDefault();
        setT(true);
      }
    };
    window.addEventListener("keydown", o);
    return () => window.removeEventListener("keydown", o);
  }, []);
  const i = React.useMemo(
    () => ({
      open: r,
      close: s,
      isOpen: t,
    }),
    [r, s, t],
  );
  return (
    <SearchPaletteContext.Provider value={i}>
      {children}
      <SearchPalette open={t} onClose={s} />
    </SearchPaletteContext.Provider>
  );
}
