import {
  Volume2,
  FileText,
  Check as CheckIcon,
  Copy as CopyIcon,
  X as XIcon,
  Pencil,
  LoaderCircle,
  Square as SquareIcon,
  Mic as MicIcon,
  Paperclip,
} from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileTopBar } from "@/components/MobileTopBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";
import { fetchFunction, supabase } from "@/integrations/supabase/client";
import { QUICK_PROMPTS, greetingName } from "@/lib/chatGreeting";
import { cn } from "@/lib/utils";

const Qe =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M5%2012L12%205L19%2012'%20stroke='%2317324d'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M12%2019V5'%20stroke='%2317324d'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
function useXe({ minHeight, maxHeight }) {
  const sRef = React.useRef(null);
  const adjustHeight = React.useCallback(
    (r) => {
      const sRef_current = sRef.current;
      if (!sRef_current) {
        return;
      }
      if (r) {
        sRef_current.style.height = `${minHeight}px`;
        return;
      }
      sRef_current.style.height = `${minHeight}px`;
      const p = Math.max(minHeight, Math.min(sRef_current.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));
      sRef_current.style.height = `${p}px`;
    },
    [minHeight, maxHeight],
  );
  React.useEffect(() => {
    const sRef_current = sRef.current;
    if (sRef_current) {
      sRef_current.style.height = `${minHeight}px`;
    }
  }, [minHeight]);
  React.useEffect(() => {
    const r = () => adjustHeight();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, [adjustHeight]);
  return {
    textareaRef: sRef,
    adjustHeight,
  };
}
function NeComponent({
  value,
  onChange,
  onSubmit,
  placeholder = "Tell ALMA about your day...",
  disabled = false,
  fileUpload,
  voiceRecorder,
}) {
  const { textareaRef, adjustHeight } = useXe({
    minHeight: 28,
    maxHeight: 200,
  });
  const onKeyDown = (M) => {
    if (M.key === "Enter" && !M.shiftKey) {
      M.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit(value);
        onChange("");
        adjustHeight(true);
      }
    }
  };
  const f = () => {
    if (value.trim() && !disabled) {
      onSubmit(value);
      onChange("");
      adjustHeight(true);
    }
  };
  return (
    <div className="flex min-h-[74px] w-full items-center gap-4 rounded-[24px] border border-[rgba(23,50,77,0.12)] bg-[#f6f9fc] py-[10px] ps-6 pe-4 transition-colors focus-within:border-alma-accent-deep">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(M) => {
          onChange(M.target.value);
          adjustHeight();
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "min-h-[28px] flex-1 resize-none border-none bg-transparent p-0",
          "font-body text-xl tracking-[0.4px] text-[rgba(23,50,77,0.9)]",
          "placeholder:text-[rgba(23,50,77,0.6)]",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        style={{
          overflow: "hidden",
        }}
      />
      <div className="flex shrink-0 items-center gap-5">
        <div className="flex items-center gap-5">
          {fileUpload}
          {voiceRecorder}
        </div>
        <button
          type="button"
          onClick={f}
          disabled={disabled || !value.trim()}
          className={cn(
            "relative flex size-[54px] shrink-0 items-center justify-center rounded-[12px]",
            "bg-gradient-to-r from-alma-accent-from to-alma-accent-to",
            "shadow-[0px_2px_6px_0px_rgba(40,94,133,0.18)]",
            "transition-opacity hover:opacity-90",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <img src={Qe} alt="" className="rtl:-scale-x-100 brightness-0 invert h-6 w-6" />
          <span className="sr-only">Send</span>
        </button>
      </div>
    </div>
  );
}
const ue = "memory-media";
const e2 = 60 * 60;
const t2 = 50 * 60 * 1000;
const xe = new Map();
function s2(t) {
  const o = xe.get(t);
  if (o) {
    if (o.expiresAt < Date.now()) {
      return xe.delete(t), null;
    }
    return o.url;
  }
  return null;
}
function r2(t, signedUrl) {
  xe.set(t, {
    url: signedUrl,
    expiresAt: Date.now() + t2,
  });
}
async function o2(storagePath) {
  const o = s2(storagePath);
  if (o) {
    return o;
  }
  const s = storagePath.replace(/^\/+/, "");
  let n = s;
  if (s.startsWith(`${ue}/`)) {
    n = s.slice(ue.length + 1);
  }
  const { data, error } = await supabase.storage.from(ue).createSignedUrl(n, e2);
  if (error || !(data != null && data.signedUrl)) {
    return console.warn(`useFreshSignedUrls: sign failed for ${storagePath}`, error?.message), null;
  }
  return r2(storagePath, data.signedUrl), data.signedUrl;
}
function useA2(attachments) {
  const [o, setO] = React.useState(() => (attachments ?? []).map((n) => n.url));
  React.useEffect(() => {
    const n = attachments ?? [];
    setO(n.map((c) => c.url));
    if (!n.length) {
      return;
    }
    let r = false;
    (async () => {
      const c = await Promise.all(
        n.map(async (p) => {
          if (p.storagePath) {
            return (await o2(p.storagePath)) ?? p.url;
          }
          return p.url;
        }),
      );
      if (!r) {
        setO(c);
      }
    })();
    return () => {
      r = true;
    };
  }, [attachments]);
  return o;
}
const n2 = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const i2 = 86400000;
function Me(t) {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
}
function c2(t, o) {
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) {
    return "";
  }
  const n = `${s.getDate()} ${n2[s.getMonth()]}`;
  const r = Math.round((Me(o) - Me(s)) / i2);
  if (r === 0) {
    return `TODAY · ${n}`;
  }
  if (r === 1) {
    return `YESTERDAY · ${n}`;
  }
  if (s.getFullYear() === o.getFullYear()) {
    return n;
  }
  return `${n} ${s.getFullYear()}`;
}
function fe(createdAt) {
  const o = new Date(createdAt);
  if (Number.isNaN(o.getTime())) {
    return "";
  }
  const s = o.getHours();
  const n = s < 12 ? "AM" : "PM";
  return `${s % 12 === 0 ? 12 : s % 12}:${String(o.getMinutes()).padStart(2, "0")} ${n}`;
}
function l2(t, o, s) {
  const n = [];
  for (const r of t) {
    const c = o(r);
    const p = new Date(c);
    const h = Number.isNaN(p.getTime()) ? "unknown" : `${p.getFullYear()}-${p.getMonth()}-${p.getDate()}`;
    const u = n[n.length - 1];
    if (u && u.key === h) {
      u.items.push(r);
    } else {
      n.push({
        key: h,
        label: c2(c, s),
        items: [r],
      });
    }
  }
  return n;
}
function d2(t, o) {
  const s = [t.trim() || "Conversation", ""];
  for (const n of o) {
    const r = n.role === "user" ? "You" : "ALMA";
    const c = fe(n.createdAt);
    s.push(c ? `${r} · ${c}` : r);
    s.push(n.content.trim());
    s.push("");
  }
  return s
    .join(
      `
`,
    )
    .trimEnd();
}
function _e(t, o) {
  const s = o.trim().toLowerCase();
  if (s === "") {
    return t;
  }
  return t.filter((n) => n.content.toLowerCase().includes(s));
}
const iconArrow =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='13'%20height='13'%20viewBox='0%200%2013%2013'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/arrow'%3e%3cpath%20id='Vector'%20d='M2.70833%206.5H10.2917M7.04167%209.75L10.2917%206.5L7.04167%203.25'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
function U2Component({ suggestions, onPick }) {
  useI18n();
  if (suggestions.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-start gap-2">
      {suggestions.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onPick(s.label)}
          className={cn(
            "flex items-center gap-[7px] rounded-full border py-[9px] ps-[14px] pe-[15px] transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
            s.recommended
              ? "border-[#9cc3de] bg-alma-panel"
              : "border-alma-hairline bg-alma-surface hover:bg-alma-panel/50",
          )}
        >
          <span
            className={cn(
              "font-body text-[12.5px] font-medium tracking-[0.25px]",
              s.recommended ? "text-alma-ink" : "text-[rgba(23,50,77,0.8)]",
            )}
          >
            {s.label}
          </span>
          {s.hint && (
            <span className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.45)]">{s.hint}</span>
          )}
        </button>
      ))}
    </div>
  );
}
function H2Component({ vaultRef }) {
  const { t: t_1 } = useI18n();
  const s = useNavigate();
  return (
    <div className="flex w-full items-center gap-[11px] rounded-[14px] border border-alma-hairline bg-alma-surface py-2.5 ps-2.5 pe-3.5 shadow-[0px_2px_8px_0px_rgba(23,41,61,0.05)]">
      {vaultRef.thumbnailUrl ? (
        <img src={vaultRef.thumbnailUrl} alt="" className="size-[38px] shrink-0 rounded-[10px] object-cover" />
      ) : (
        <span className="size-[38px] shrink-0 rounded-[10px] bg-alma-panel" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate font-body text-[13px] font-medium tracking-[0.26px] text-alma-ink">
          {vaultRef.title ?? "Kept in your Memory Vault"}
        </p>
        {vaultRef.subtitle && (
          <p className="truncate font-body text-[11px] leading-4 tracking-[0.22px] text-alma-faint">
            {vaultRef.subtitle}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => s("/memory-vault")}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] py-2 ps-[13px] pe-[11px] font-body text-xs font-medium tracking-[0.24px] text-[rgba(23,50,77,0.8)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
      >
        {t_1("chat.view")}
        <img src={iconArrow} alt="" className="rtl:-scale-x-100 h-[13px] w-[13px]" />
      </button>
    </div>
  );
}
function M21({
  role,
  content,
  attachments,
  createdAt,
  suggestions,
  vaultRef,
  onPickSuggestion,
  onEdit,
  isEditing,
  onStartEdit,
  onCancelEdit,
  autoPlay,
}) {
  const { t: t_1 } = useI18n();
  const y = role === "user";
  const [g, setG] = React.useState(content);
  const [R, setR] = React.useState(false);
  const V = useA2(attachments);
  const [A, setA] = React.useState("idle");
  const YRef = React.useRef(null);
  const ORef = React.useRef(null);
  React.useEffect(
    () => () => {
      YRef.current?.pause();
      if (ORef.current) {
        URL.revokeObjectURL(ORef.current);
      }
    },
    [],
  );
  const te = () => {
    YRef.current?.pause();
    setA("idle");
  };
  const se = async () => {
    if (A === "playing") {
      return te();
    }
    if (A !== "loading") {
      try {
        setA("loading");
        if (!ORef.current) {
          const { data, error } = await supabase.functions.invoke("tts", {
            body: {
              text: content,
            },
          });
          if (error) {
            throw error;
          }
          const q = new Blob([data], {
            type: "audio/mpeg",
          });
          ORef.current = URL.createObjectURL(q);
        }
        const m = YRef.current ?? new Audio();
        YRef.current = m;
        m.src = ORef.current;
        m.onended = () => setA("idle");
        m.onerror = () => setA("idle");
        await m.play();
        setA("playing");
      } catch (error) {
        console.error("tts playback failed", error);
        setA("idle");
        toast.error("Couldn't play that just now");
      }
    }
  };
  const reRef = React.useRef(false);
  React.useEffect(() => {
    if (!(!autoPlay || reRef.current || y || !content.trim())) {
      reRef.current = true;
      se();
    }
  }, [autoPlay, content, y]);
  const ne = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setR(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setR(false), 2000);
    } catch {
      toast.error(t_1("common.err.copy"));
    }
  };
  const P = () => {
    if (g.trim() && onEdit) {
      onEdit(g.trim());
    }
  };
  const oe = () => {
    setG(content);
    onCancelEdit?.();
  };
  const AeComponent = () => {
    if (!attachments || attachments.length === 0) {
      return null;
    }
    return (
      <div className={cn("flex flex-wrap gap-2", y && "justify-end")}>
        {attachments.map((m, B) => {
          const L = V[B] ?? m.url;
          if (m.type.startsWith("image/")) {
            return (
              <a key={B} href={L} target="_blank" rel="noopener noreferrer">
                <img
                  src={L}
                  alt="attachment"
                  className="h-[168px] w-[250px] rounded-[18px] border-[3px] border-white object-cover shadow-[0px_6px_18px_0px_rgba(23,50,77,0.12)] transition-opacity hover:opacity-90"
                />
              </a>
            );
          }
          if (m.type.startsWith("audio/")) {
            return (
              <div
                key={B}
                className="flex items-center gap-2 rounded-[16px] border border-[rgba(23,50,77,0.1)] bg-white px-3 py-2"
              >
                <Volume2 className="h-4 w-4 text-[rgba(23,50,77,0.6)]" />
                <audio controls className="h-8">
                  <source src={L} type={m.type} />
                  {t_1("chat.noAudio")}
                </audio>
              </div>
            );
          }
          return (
            <a
              key={B}
              href={L}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[16px] border border-[rgba(23,50,77,0.1)] bg-white px-3 py-2 font-body text-xs text-[rgba(23,50,77,0.8)] transition-opacity hover:opacity-80"
            >
              <FileText className="h-4 w-4" />
              {m.name || "Document"}
            </a>
          );
        })}
      </div>
    );
  };
  const $ = (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={ne} title={t_1("chat.copyMessage")}>
      {R ? <CheckIcon className="h-3 w-3 text-alma-accent-ring" /> : <CopyIcon className="h-3 w-3" />}
    </Button>
  );
  if (y) {
    return (
      <div className="group flex w-full flex-col items-end gap-2 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {AeComponent()}
        {isEditing ? (
          <div className="w-full space-y-2">
            <Textarea
              value={g}
              onChange={(m) => setG(m.target.value)}
              className="min-h-[80px] resize-none bg-white"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={oe} className="h-8 px-3">
                <XIcon className="me-1 h-3 w-3" />
                {t_1("action.cancel")}
              </Button>
              <Button size="sm" onClick={P} className="h-8 px-3">
                <CheckIcon className="me-1 h-3 w-3" />
                Save & Send
              </Button>
            </div>
          </div>
        ) : content ? (
          <>
            <div className="max-w-[80%] rounded-[18px] rounded-br-[6px] bg-alma-panel px-4 py-3">
              <p className="whitespace-pre-wrap break-words font-body text-[15px] leading-[21px] tracking-[0.15px] text-alma-ink">
                {content}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {onStartEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onStartEdit}
                  title={t_1("chat.editMessage")}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
              {$}
            </div>
          </>
        ) : null}
      </div>
    );
  }
  return (
    <div className="group flex w-full flex-col gap-2.5 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-[9px]">
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-deep font-body text-xs font-semibold text-white">
          A
        </span>
        <span className="font-body text-[12.5px] font-medium tracking-[0.25px] text-[rgba(23,50,77,0.85)]">ALMA</span>
        {createdAt && fe(createdAt) && (
          <>
            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[rgba(23,50,77,0.42)]" />
            <span className="font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.42)]">{fe(createdAt)}</span>
          </>
        )}
      </div>
      <div className="flex flex-col gap-3 ps-[35px]">
        {AeComponent()}
        {content && (
          <p className="whitespace-pre-wrap break-words font-body text-[14.5px] leading-6 tracking-[0.145px] text-[rgba(23,50,77,0.85)]">
            {content}
          </p>
        )}
        {suggestions && suggestions.length > 0 && onPickSuggestion && (
          <U2Component suggestions={suggestions} onPick={onPickSuggestion} />
        )}
        {vaultRef && <H2Component vaultRef={vaultRef} />}
        {content && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={se}
              disabled={A === "loading"}
              title={A === "playing" ? "Stop" : "Play this message aloud"}
              aria-label={A === "playing" ? "Stop playback" : "Play this message aloud"}
            >
              {A === "loading" ? (
                <LoaderCircle className="h-3 w-3 animate-spin" />
              ) : A === "playing" ? (
                <SquareIcon className="h-3 w-3 text-alma-accent-ring" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </Button>
            {$}
          </div>
        )}
      </div>
    </div>
  );
}
function VeComponent({ onTranscription, icon, className }) {
  const { t: t_1 } = useI18n();
  const [r, setR] = React.useState(false);
  const [p, setP] = React.useState(false);
  const uRef = React.useRef(null);
  const kRef = React.useRef([]);
  const f = async () => {
    try {
      const y = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const g = new MediaRecorder(y);
      uRef.current = g;
      kRef.current = [];
      g.ondataavailable = (_) => {
        if (_.data.size > 0) {
          kRef.current.push(_.data);
        }
      };
      g.onstop = async () => {
        const _ = new Blob(kRef.current, {
          type: "audio/webm",
        });
        await N(_);
        y.getTracks().forEach((R) => R.stop());
      };
      g.start();
      setR(true);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error(t_1("voice.err.start"));
    }
  };
  const M = () => {
    if (uRef.current && r) {
      uRef.current.stop();
      setR(false);
      setP(true);
    }
  };
  const N = async (y) => {
    try {
      const g = new FileReader();
      g.readAsDataURL(y);
      g.onloadend = async () => {
        const audio = g.result.split(",")[1];
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please log in to use voice recording");
          setP(false);
          return;
        }
        const v = await fetchFunction("transcribe-audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            audio,
          }),
        });
        if (!v.ok) {
          throw new Error("Transcription failed");
        }
        const { text } = await v.json();
        onTranscription(text);
        toast.success("Transcription complete");
        setP(false);
      };
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error(t_1("voice.err.transcribe"));
      setP(false);
    }
  };
  return (
    <button
      type="button"
      onClick={r ? M : f}
      disabled={p}
      aria-label={r ? "Stop recording" : "Record a voice note"}
      className={cn("relative", className ?? "p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50")}
    >
      {p ? (
        <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : r ? (
        <>
          <SquareIcon className="h-4 w-4 text-destructive fill-destructive" />
          <span className="absolute top-0.5 end-0.5 h-2 w-2 bg-destructive rounded-full animate-pulse" />
        </>
      ) : (
        (icon ?? <MicIcon className="h-4 w-4 text-muted-foreground" />)
      )}
    </button>
  );
}
function SeComponent({ onFileUploaded, icon, className }) {
  const { t: t_1 } = useI18n();
  const [r, setR] = React.useState(false);
  const pRef = React.useRef(null);
  const h = () => {
    pRef.current?.click();
  };
  const onChange = async (k) => {
    const f = k.target.files?.[0];
    if (!f) {
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    if (
      ![
        "image/",
        "application/pdf",
        "text/",
        "application/msword",
        "application/vnd.openxmlformats-officedocument",
      ].some((g) => f.type.startsWith(g))
    ) {
      toast.error("File type not supported. Please upload images, PDFs, or documents.");
      return;
    }
    setR(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to upload files");
        setR(false);
        return;
      }
      const _ = f.name.split(".").pop();
      const R = `${user.id}/${Date.now()}.${_}`;
      const { data, error } = await supabase.storage.from("memories").upload(R, f);
      if (error) {
        throw error;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("memories").getPublicUrl(R);
      onFileUploaded(publicUrl, f.type);
      toast.success(`${f.name} attached successfully`);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(t_1("upload.err.file"));
    } finally {
      setR(false);
      if (pRef.current) {
        pRef.current.value = "";
      }
    }
  };
  return (
    <>
      <input ref={pRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt" onChange={onChange} className="hidden" />
      <button
        type="button"
        onClick={h}
        disabled={r}
        aria-label={t_1("chat.attachFile")}
        className={className ?? "p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"}
      >
        {r ? (
          <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          (icon ?? <Paperclip className="h-4 w-4 text-muted-foreground" />)
        )}
      </button>
    </>
  );
}
const iconMenu =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/menu'%3e%3cpath%20id='Vector'%20d='M3.66667%205.5H18.3333M3.66667%2011H18.3333M3.66667%2016.5H18.3333'%20stroke-width='1.65'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.7'/%3e%3c/g%3e%3c/svg%3e";
const iconEdit =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/edit'%3e%3cpath%20id='Vector'%20d='M11%2018.3333H19.25'%20stroke-width='1.65'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.7'/%3e%3cpath%20id='Vector_2'%20d='M15.125%203.20833C15.4897%202.84366%2015.9843%202.63879%2016.5%202.63879C17.0157%202.63879%2017.5103%202.84366%2017.875%203.20833C18.2397%203.57301%2018.4445%204.06761%2018.4445%204.58333C18.4445%205.09906%2018.2397%205.59366%2017.875%205.95833L6.41667%2017.4167L2.75%2018.3333L3.66667%2014.6667L15.125%203.20833Z'%20stroke-width='1.65'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.7'/%3e%3c/g%3e%3c/svg%3e";
const Journal =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M1.33333%204H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M1.33333%206.66667H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M1.33333%209.33333H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M1.33333%2012H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M12%201.33333H4C3.26362%201.33333%202.66667%201.93029%202.66667%202.66667V13.3333C2.66667%2014.0697%203.26362%2014.6667%204%2014.6667H12C12.7364%2014.6667%2013.3333%2014.0697%2013.3333%2013.3333V2.66667C13.3333%201.93029%2012.7364%201.33333%2012%201.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_6'%20d='M6.33333%205.33333H9.66667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_7'%20d='M6.33333%208H10.6667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_8'%20d='M6.33333%2010.6667H9.33333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const Remember =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M8%203.33333C8.00079%203.06669%207.94824%202.80258%207.84546%202.55653C7.74268%202.31049%207.59174%202.08748%207.40151%201.90063C7.21129%201.71378%206.98561%201.56685%206.73777%201.46849C6.48993%201.37013%206.22492%201.32232%205.95833%201.32787C5.69174%201.33343%205.42895%201.39224%205.18543%201.50084C4.9419%201.60945%204.72254%201.76565%204.54027%201.96027C4.35799%202.15489%204.21647%202.38399%204.12403%202.6341C4.0316%202.88421%203.9901%203.15028%204.002%203.41667C3.61013%203.51742%203.24633%203.70603%202.93815%203.96821C2.62997%204.23038%202.38549%204.55925%202.22323%204.9299C2.06097%205.30055%201.98517%205.70326%202.00159%206.10754C2.01801%206.51182%202.12621%206.90706%202.318%207.26333C1.98079%207.53729%201.71562%207.88949%201.54556%208.28929C1.3755%208.68909%201.30571%209.1244%201.34224%209.55733C1.37878%209.99026%201.52054%2010.4077%201.7552%2010.7733C1.98986%2011.139%202.31031%2011.4418%202.68867%2011.6553C2.64194%2012.0168%202.66983%2012.3841%202.77059%2012.7343C2.87136%2013.0846%203.04286%2013.4106%203.27452%2013.692C3.50618%2013.9734%203.79307%2014.2043%204.11748%2014.3705C4.44189%2014.5367%204.79692%2014.6346%205.16065%2014.6582C5.52438%2014.6818%205.88909%2014.6306%206.23226%2014.5077C6.57542%2014.3849%206.88975%2014.193%207.15584%2013.9438C7.42193%2013.6947%207.63412%2013.3937%207.77931%2013.0594C7.9245%2012.725%207.99961%2012.3645%208%2012V3.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M6%208.66667C6.5597%208.46977%207.04845%208.11133%207.40445%207.63667C7.76045%207.16201%207.9677%206.59245%208%206'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M4.002%203.41667C4.01518%203.73916%204.10622%204.05366%204.26733%204.33333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M2.318%207.264C2.43996%207.16467%202.57047%207.07633%202.708%207'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M4%2012C3.54055%2012.0002%203.08884%2011.8817%202.68867%2011.656'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_6'%20d='M8%208.66667H10.6667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_7'%20d='M8%2012H12C12.3536%2012%2012.6928%2012.1405%2012.9428%2012.3905C13.1929%2012.6406%2013.3333%2012.9797%2013.3333%2013.3333V14'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_8'%20d='M8%205.33333H13.3333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_9'%20d='M10.6667%205.33333V3.33333C10.6667%202.97971%2010.8071%202.64057%2011.0572%202.39052C11.3072%202.14048%2011.6464%202%2012%202'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_10'%20d='M10.6667%209C10.8508%209%2011%208.85076%2011%208.66667C11%208.48257%2010.8508%208.33333%2010.6667%208.33333C10.4826%208.33333%2010.3333%208.48257%2010.3333%208.66667C10.3333%208.85076%2010.4826%209%2010.6667%209Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_11'%20d='M12%202.33333C12.1841%202.33333%2012.3333%202.18409%2012.3333%202C12.3333%201.81591%2012.1841%201.66667%2012%201.66667C11.8159%201.66667%2011.6667%201.81591%2011.6667%202C11.6667%202.18409%2011.8159%202.33333%2012%202.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_12'%20d='M13.3333%2014.3333C13.5174%2014.3333%2013.6667%2014.1841%2013.6667%2014C13.6667%2013.8159%2013.5174%2013.6667%2013.3333%2013.6667C13.1492%2013.6667%2013%2013.8159%2013%2014C13%2014.1841%2013.1492%2014.3333%2013.3333%2014.3333Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_13'%20d='M13.3333%205.66667C13.5174%205.66667%2013.6667%205.51743%2013.6667%205.33333C13.6667%205.14924%2013.5174%205%2013.3333%205C13.1492%205%2013%205.14924%2013%205.33333C13%205.51743%2013.1492%205.66667%2013.3333%205.66667Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const Schedule =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M7.33333%208.66667H8V11.3333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M10.6667%201.33333V3.33333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M2%206H14'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M5.33333%201.33333V3.33333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M12.6667%202H3.33333C2.59695%202%202%202.59695%202%203.33333V12.6667C2%2013.403%202.59695%2014%203.33333%2014H12.6667C13.403%2014%2014%2013.403%2014%2012.6667V3.33333C14%202.59695%2013.403%202%2012.6667%202Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const Reflect =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M8%201.33333V2.66667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M9.89133%2010.9233C9.72711%2011.6161%209.38095%2012.2525%208.8886%2012.7668C8.39625%2013.2811%207.77555%2013.6546%207.0906%2013.8489C6.40564%2014.0432%205.68124%2014.0511%204.9922%2013.8718C4.30316%2013.6926%203.67444%2013.3327%203.17097%2012.8293C2.66749%2012.3259%202.30751%2011.6972%202.12817%2011.0082C1.94884%2010.3192%201.95666%209.59479%202.15082%208.90981C2.34499%208.22482%202.71846%207.60408%203.23269%207.11166C3.74691%206.61924%204.38325%206.27299%205.076%206.10867C5.492%206.01067%205.72267%206.54867%205.55267%206.94067C5.34045%207.43127%205.28057%207.97432%205.3808%208.49937C5.48102%209.02442%205.73672%209.50723%206.11473%209.88516C6.49274%2010.2631%206.9756%2010.5187%207.50066%2010.6188C8.02573%2010.719%208.56877%2010.659%209.05933%2010.4467C9.452%2010.2767%209.99%2010.5067%209.89133%2010.9233Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M10.6667%208C10.6667%207.29276%2010.3857%206.61448%209.88562%206.11438C9.38552%205.61428%208.70724%205.33333%208%205.33333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M12.6667%203.33333L11.8293%204.17067'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M13.3333%208H14.6667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const b2 = {
  Journal,
  Remember,
  Schedule,
  Reflect,
};
function V21({ onPick }) {
  const o = QUICK_PROMPTS.length - 1;
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-center sm:gap-[5px]">
      {QUICK_PROMPTS.map((s, n) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onPick(s.prompt)}
          className={cn(
            "flex items-center justify-center gap-2.5 border border-[rgba(23,50,77,0.12)] px-3 py-2 sm:justify-start",
            "font-body text-sm tracking-[0.28px] text-[rgba(23,50,77,0.8)]",
            "transition-colors hover:border-alma-accent-deep hover:bg-[rgba(40,94,133,0.06)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
            n === 0 && "rounded-s-[24px] rounded-e-[8px]",
            n === o && "rounded-s-[8px] rounded-e-[24px]",
            n !== 0 && n !== o && "rounded-[8px]",
          )}
        >
          <img src={b2[s.label]} alt="" className="h-4 w-4 shrink-0" />
          {s.label}
        </button>
      ))}
    </div>
  );
}
const iconSearch =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/search'%3e%3cpath%20id='Vector'%20d='M7.79167%2012.75C10.5301%2012.75%2012.75%2010.5301%2012.75%207.79167C12.75%205.05325%2010.5301%202.83333%207.79167%202.83333C5.05325%202.83333%202.83333%205.05325%202.83333%207.79167C2.83333%2010.5301%205.05325%2012.75%207.79167%2012.75Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M14.1667%2014.1667L11.6875%2011.6875'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconShare =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/share'%3e%3cpath%20id='Vector'%20d='M12.75%205.66667C13.9236%205.66667%2014.875%204.71527%2014.875%203.54167C14.875%202.36806%2013.9236%201.41667%2012.75%201.41667C11.5764%201.41667%2010.625%202.36806%2010.625%203.54167C10.625%204.71527%2011.5764%205.66667%2012.75%205.66667Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M4.25%2010.625C5.4236%2010.625%206.375%209.6736%206.375%208.5C6.375%207.32639%205.4236%206.375%204.25%206.375C3.07639%206.375%202.125%207.32639%202.125%208.5C2.125%209.6736%203.07639%2010.625%204.25%2010.625Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M12.75%2015.5833C13.9236%2015.5833%2014.875%2014.6319%2014.875%2013.4583C14.875%2012.2847%2013.9236%2011.3333%2012.75%2011.3333C11.5764%2011.3333%2010.625%2012.2847%2010.625%2013.4583C10.625%2014.6319%2011.5764%2015.5833%2012.75%2015.5833Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M6.09167%209.5625L10.9083%2012.3958M10.9083%204.60417L6.09167%207.4375'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconMore =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/more'%3e%3cpath%20id='Vector'%20d='M3.54167%209.20833C3.93287%209.20833%204.25%208.8912%204.25%208.5C4.25%208.1088%203.93287%207.79167%203.54167%207.79167C3.15046%207.79167%202.83333%208.1088%202.83333%208.5C2.83333%208.8912%203.15046%209.20833%203.54167%209.20833Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M8.5%209.20833C8.8912%209.20833%209.20833%208.8912%209.20833%208.5C9.20833%208.1088%208.8912%207.79167%208.5%207.79167C8.1088%207.79167%207.79167%208.1088%207.79167%208.5C7.79167%208.8912%208.1088%209.20833%208.5%209.20833Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M13.4583%209.20833C13.8495%209.20833%2014.1667%208.8912%2014.1667%208.5C14.1667%208.1088%2013.8495%207.79167%2013.4583%207.79167C13.0671%207.79167%2012.75%208.1088%2012.75%208.5C12.75%208.8912%2013.0671%209.20833%2013.4583%209.20833Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const className =
  "flex size-[38px] shrink-0 items-center justify-center rounded-[12px] border border-[rgba(23,50,77,0.11)] bg-white/90 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring";
function M2Component({
  title,
  searchOpen,
  query,
  onQueryChange,
  onToggleSearch,
  onCopyTranscript,
  onNewChat,
  onDelete,
}) {
  const { t: t_1 } = useI18n();
  const kRef = React.useRef(null);
  return (
    <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 px-4 sm:px-[30px] pb-4 pt-[38px]">
      <div className="flex min-w-0 flex-col gap-3">
        <p className="font-body text-sm tracking-[0.14px] text-[rgba(23,50,77,0.6)]">{t_1("chat.conversation")}</p>
        <h1 className="truncate font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {searchOpen && (
          <div className="relative">
            <input
              ref={kRef}
              autoFocus
              value={query}
              onChange={(f) => onQueryChange(f.target.value)}
              onKeyDown={(f) => f.key === "Escape" && onToggleSearch()}
              placeholder={t_1("chat.searchThis")}
              aria-label={t_1("chat.searchThis")}
              className="h-[38px] w-[220px] rounded-[12px] border border-[rgba(23,50,77,0.11)] bg-white/90 ps-3 pe-8 font-body text-[13px] text-[rgba(23,50,77,0.9)] outline-none transition-colors placeholder:text-[rgba(23,50,77,0.45)] focus:border-alma-accent-deep"
            />
            <button
              type="button"
              onClick={onToggleSearch}
              aria-label={t_1("nav.closeSearchBox")}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-[rgba(23,50,77,0.5)] hover:text-[rgba(23,50,77,0.9)]"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <button type="button" onClick={onToggleSearch} aria-label={t_1("chat.searchThis")} className={className}>
          <img src={iconSearch} alt="" className="h-[17px] w-[17px]" />
        </button>
        <button type="button" onClick={onCopyTranscript} aria-label={t_1("chat.copyTranscript")} className={className}>
          <img src={iconShare} alt="" className="h-[17px] w-[17px]" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={t_1("chat.options")} className={className}>
              <img src={iconMore} alt="" className="h-[17px] w-[17px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 border bg-popover z-50">
            <DropdownMenuItem onClick={onNewChat} className="cursor-pointer">
              {t_1("chat.newChat")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCopyTranscript} className="cursor-pointer">
              {t_1("chat.copyTranscript")}
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
                  {t_1("chat.deleteConversation")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
const _2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='WhatsApp%20logo'%20clip-path='url(%23clip0_0_625)'%3e%3cg%20id='Group'%20filter='url(%23filter0_f_0_625)'%3e%3cpath%20id='Vector'%20d='M9.09622%2026.7789L9.56811%2027.0585C11.5501%2028.2347%2013.8225%2028.8569%2016.14%2028.858H16.1448C23.2616%2028.858%2029.0536%2023.0673%2029.0565%2015.9501C29.0578%2012.5012%2027.716%209.25789%2025.2782%206.8182C24.0825%205.61501%2022.6601%204.66093%2021.0932%204.01119C19.5263%203.36144%2017.8461%203.02894%2016.1499%203.03293C9.0276%203.03293%203.23547%208.82295%203.23293%2015.9398C3.22943%2018.3699%203.91377%2020.7515%205.20686%2022.8091L5.51406%2023.2973L4.20944%2028.0601L9.09622%2026.7789ZM0.479492%2031.7499L2.68355%2023.7026C1.32425%2021.3476%200.609131%2018.6759%200.609975%2015.9387C0.613564%207.37581%207.58194%200.409546%2016.145%200.409546C20.3004%200.411657%2024.2008%202.02876%2027.1341%204.9642C30.0674%207.89964%2031.6814%2011.8015%2031.6799%2015.9512C31.6761%2024.5134%2024.7067%2031.4809%2016.1448%2031.4809H16.1381C13.5383%2031.4799%2010.9838%2030.8277%208.71469%2029.5904L0.479492%2031.7499Z'%20fill='%23B3B3B3'/%3e%3c/g%3e%3cpath%20id='Vector_2'%20d='M0.320068%2031.5904L2.52413%2023.5431C1.16249%2021.1824%200.447262%2018.5044%200.450551%2015.7791C0.454141%207.21626%207.42252%200.25%2015.9856%200.25C20.141%200.252111%2024.0413%201.86921%2026.9747%204.80465C29.908%207.7401%2031.5219%2011.6419%2031.5205%2015.7916C31.5167%2024.3539%2024.5472%2031.3214%2015.9854%2031.3214H15.9786C13.3789%2031.3203%2010.8244%2030.6681%208.55527%2029.4309L0.320068%2031.5904Z'%20fill='white'/%3e%3cpath%20id='Vector_3'%20d='M15.9902%202.87345C8.86792%202.87345%203.07579%208.66347%203.07326%2015.7803C3.06975%2018.2105%203.75409%2020.592%205.04718%2022.6496L5.35438%2023.138L4.04977%2027.9008L8.93675%2026.6194L9.40864%2026.899C11.3906%2028.0752%2013.6631%2028.6972%2015.9805%2028.6985H15.9854C23.1022%2028.6985%2028.8943%2022.9078%2028.897%2015.7906C28.9024%2014.0943%2028.5712%2012.4137%2027.9227%2010.8462C27.2741%209.27867%2026.3211%207.85539%2025.1187%206.65872C23.923%205.45551%2022.5006%204.50141%2020.9337%203.85167C19.3667%203.20192%2017.6865%202.86943%2015.9902%202.87345Z'%20fill='url(%23paint0_linear_0_625)'/%3e%3cpath%20id='Vector_4'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M12.1027%209.28683C11.8118%208.64054%2011.5056%208.62745%2011.2293%208.61626L10.4852%208.60718C10.2264%208.60718%209.80578%208.7043%209.45022%209.09279C9.09467%209.48129%208.09155%2010.4202%208.09155%2012.33C8.09155%2014.2397%209.48253%2016.085%209.67635%2016.3443C9.87017%2016.6036%2012.3616%2020.6475%2016.3071%2022.2034C19.5859%2023.4964%2020.2531%2023.2392%2020.965%2023.1746C21.677%2023.11%2023.2616%2022.2357%2023.5848%2021.3293C23.9081%2020.4228%2023.9083%2019.6463%2023.8114%2019.4839C23.7144%2019.3216%2023.4556%2019.2251%2023.0671%2019.0308C22.6786%2018.8366%2020.7706%2017.8976%2020.4148%2017.768C20.059%2017.6384%2019.8004%2017.574%2019.5413%2017.9625C19.2823%2018.351%2018.5393%2019.2249%2018.3127%2019.4839C18.0862%2019.743%2017.86%2019.7755%2017.4715%2019.5815C17.083%2019.3874%2015.8331%2018.9774%2014.3501%2017.655C13.1962%2016.6262%2012.4173%2015.3555%2012.1906%2014.9673C11.9638%2014.579%2012.1665%2014.3687%2012.3612%2014.1753C12.5354%2014.0013%2012.7492%2013.722%2012.9437%2013.4954C13.1382%2013.2689%2013.2021%2013.1069%2013.3313%2012.8483C13.4606%2012.5897%2013.3962%2012.3625%2013.299%2012.1684C13.2019%2011.9744%2012.4477%2010.0545%2012.1027%209.28683Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_f_0_625'%20x='0.379492'%20y='0.309546'%20width='31.4004'%20height='31.5404'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='BackgroundImageFix'%20result='shape'/%3e%3cfeGaussianBlur%20stdDeviation='0.05'%20result='effect1_foregroundBlur_0_625'/%3e%3c/filter%3e%3clinearGradient%20id='paint0_linear_0_625'%20x1='15.7223'%20y1='4.4232'%20x2='15.8532'%20y2='26.4923'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%2357D163'/%3e%3cstop%20offset='1'%20stop-color='%2323B33A'/%3e%3c/linearGradient%3e%3cclipPath%20id='clip0_0_625'%3e%3crect%20width='32'%20height='32'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
function Re(t) {
  return `alma:wa-banner-dismissed:${t}`;
}
function V2Component() {
  const { t } = useI18n();
  const [o, setO] = React.useState(false);
  const [n, setN] = React.useState(null);
  const c = useNavigate();
  React.useEffect(() => {
    let h = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || h) {
        return;
      }
      setN(user.id);
      try {
        if (window.localStorage.getItem(Re(user.id)) === "1") {
          return;
        }
      } catch {}
      const { data } = await supabase.from("profiles").select("phone").eq("user_id", user.id).maybeSingle();
      if (h) {
        return;
      }
      const f = data?.phone;
      if (!f || f.trim() === "") {
        setO(true);
      }
    })();
    return () => {
      h = true;
    };
  }, []);
  const p = () => {
    if (n) {
      try {
        window.localStorage.setItem(Re(n), "1");
      } catch {}
    }
    setO(false);
  };
  if (o) {
    return (
      <div className="mx-auto flex w-full max-w-[786px] items-center justify-between gap-5 rounded-[24px] border border-[rgba(23,50,77,0.12)] bg-gradient-to-r from-[#eaf3fa] to-[#f6f9fc] px-5 py-5">
        <div className="flex min-w-0 items-center gap-5">
          <img src={_2} alt="" className="h-8 w-8 shrink-0" />
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink/70">{t("wa.oneTime")}</p>
            <p className="mt-1 font-body text-xs tracking-[0.24px] text-[rgba(23,50,77,0.6)]">{t("wa.landsInVault")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <button
            type="button"
            onClick={() => c("/settings")}
            className="flex h-9 items-center justify-center rounded-[24px] bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-4 font-body text-xs font-bold tracking-[0.24px] text-white shadow-[0px_2px_6px_0px_rgba(40,94,133,0.18)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
          >
            {t("wa.linkNow")}
          </button>
          <button
            type="button"
            onClick={p}
            aria-label={t("wa.dismiss")}
            className="shrink-0 rounded p-1 text-[rgba(23,50,77,0.5)] transition-colors hover:text-[rgba(23,50,77,0.9)]"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
  return null;
}
const Ae =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='add'%3e%3cpath%20id='Vector'%20d='M12%2022C17.5228%2022%2022%2017.5228%2022%2012C22%206.47715%2017.5228%202%2012%202C6.47715%202%202%206.47715%202%2012C2%2017.5228%206.47715%2022%2012%2022Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M8%2012H16'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M12%208V16'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const Te =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='mic'%3e%3cpath%20id='Vector'%20d='M12%2019V22'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M19%2010V12C19%2013.8565%2018.2625%2015.637%2016.9497%2016.9497C15.637%2018.2625%2013.8565%2019%2012%2019C10.1435%2019%208.36301%2018.2625%207.05025%2016.9497C5.7375%2015.637%205%2013.8565%205%2012V10'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M15%205C15%203.34315%2013.6569%202%2012%202C10.3431%202%209%203.34315%209%205V12C9%2013.6569%2010.3431%2015%2012%2015C13.6569%2015%2015%2013.6569%2015%2012V5Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
export default function Chat() {
  const { t } = useI18n();
  const o = useMobileNav();
  const [s, setS] = React.useState([]);
  const [r, setR] = React.useState(null);
  const [p, setP] = React.useState([]);
  const [u, setU] = React.useState(null);
  const fRef = React.useRef(false);
  const [value, setValue] = React.useState("");
  const [y, setY] = React.useState(false);
  const ref = React.useRef(null);
  const RRef = React.useRef(null);
  const [v, setV] = React.useState([]);
  const [A, setA] = React.useState(null);
  const Y = () => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  React.useEffect(() => {
    Y();
  }, [p]);
  const O = useLocation();
  const [te, setTe] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [P, setP_1] = React.useState("");
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const data_user = data.user;
      if (data_user) {
        setTe(greetingName(data_user.user_metadata?.display_name, data_user.email));
      }
    });
  }, []);
  React.useEffect(() => {
    ae();
  }, []);
  const ae = async () => {
    const { data, error } = await supabase.from("conversations").select("*").order("updated_at", {
      ascending: false,
    });
    if (error) {
      console.error("Error fetching conversations:", error);
      toast.error(t("chat.err.loadConversations"));
      return;
    }
    setS(data || []);
    const d = O.state ?? null;
    if (d != null && d.draft) {
      setValue(d.draft);
    }
    if (d != null && d.newConversation) {
      window.history.replaceState({}, "");
      await m();
      return;
    }
    if (d?.conversationId && data != null && data.some((w) => w.id === d.conversationId)) {
      window.history.replaceState({}, "");
      onSelectConversation(d.conversationId);
      return;
    }
    if (data && data.length > 0 && !r) {
      onSelectConversation(data[0].id);
    }
  };
  const onSelectConversation = async (a) => {
    setR(a);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", a)
      .order("created_at", {
        ascending: true,
      });
    if (error) {
      console.error("Error loading messages:", error);
      toast.error(t("chat.err.loadMessages"));
      return;
    }
    const w = (data || []).map((I) => {
      const I_metadata = I.metadata;
      return {
        id: I.id,
        role: I.role,
        content: I.content,
        createdAt: I.created_at,
        attachments: I_metadata?.attachments || undefined,
        suggestions: I_metadata?.suggestions || undefined,
        vaultRef: I_metadata?.vault_ref || undefined,
      };
    });
    setP(w);
  };
  const m = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error(t("chat.err.loginConversation"));
      return;
    }
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: "New Conversation",
      })
      .select()
      .single();
    if (error) {
      console.error("Error creating conversation:", error);
      toast.error(t("chat.err.createConversation"));
      return;
    }
    setS([data, ...s]);
    setR(data.id);
    setP([]);
  };
  const B = async (a, i) => {
    setA(null);
    const d = p.findIndex((C) => C.id === a);
    if (d === -1) {
      return;
    }
    const w = p.slice(0, d);
    setP(w);
    const I = p.slice(d);
    for (const C of I) {
      await supabase.from("chat_messages").delete().eq("id", C.id);
    }
    await onSubmit(i);
  };
  const onDeleteConversation = async (a) => {
    const { error } = await supabase.from("conversations").delete().eq("id", a);
    if (error) {
      console.error("Error deleting conversation:", error);
      toast.error(t("chat.err.deleteConversation"));
      return;
    }
    const d = s.filter((w) => w.id !== a);
    setS(d);
    if (r === a) {
      if (d.length > 0) {
        onSelectConversation(d[0].id);
      } else {
        setR(null);
        setP([]);
      }
    }
  };
  const onSubmit = async (a) => {
    if (!r) {
      await m();
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error(t("chat.err.loginSend"));
      return;
    }
    const d = {
      id: crypto.randomUUID(),
      role: "user",
      content: a,
      createdAt: new Date().toISOString(),
      attachments: v.length > 0 ? [...v] : undefined,
    };
    setP((S) => [...S, d]);
    setY(true);
    const w = [...v];
    setV([]);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const ie = (T) => {
          const j = new Set();
          for (const U of T) {
            const F = (U.type ?? "").toLowerCase();
            if (F.startsWith("image/")) {
              j.add("image");
              j.add("photo");
            } else if (F.startsWith("audio/")) {
              j.add("audio");
              j.add("voice");
            } else if (F.startsWith("video/")) {
              j.add("video");
            } else if (F === "application/pdf") {
              j.add("document");
              j.add("pdf");
            } else if (F.startsWith("application/") || F.startsWith("text/")) {
              j.add("document");
            }
          }
          return [...j];
        };
        const { data, error } = await supabase
          .from("memories")
          .insert({
            user_id: user.id,
            content: a,
            type: w.length > 0 ? "attachment" : "text",
            tags: w.length > 0 ? ie(w) : [],
            metadata:
              w.length > 0
                ? {
                    attachments: w,
                    source: "web-chat",
                  }
                : null,
            timestamp: new Date().toISOString(),
          })
          .select("id")
          .single();
        if (error) {
          console.error("Error saving memory:", error);
          toast.error(t("chat.err.saveMemory"));
        } else if (data?.id && w.length > 0) {
          const T = w.map((U) => ({
            memory_id: data.id,
            file_url: U.url,
            file_type: U.type ?? null,
            file_size: null,
            transcription: null,
          }));
          const { error: error_1 } = await supabase.from("memory_media").insert(T);
          if (error_1) {
            console.error("Error saving memory_media:", error_1);
            toast.error(t("chat.err.saveMemoryMedia"));
          } else {
            toast.success(t("chat.ok.memorySaved"));
          }
        }
      }
    } catch (error) {
      console.error("Error saving memory:", error);
      toast.error(t("chat.err.saveMemory"));
    }
    try {
      const S = await fetchFunction("chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          conversationId: r,
          message: a,
          attachments: w,
          userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      if (!S.ok || !S.body) {
        throw new Error("Failed to get response");
      }
      const ie = S.body.getReader();
      const J = new TextDecoder();
      let content = "";
      let T = "";
      let j = [];
      const id = crypto.randomUUID();
      const F = fRef.current;
      fRef.current = false;
      setP((ce) => [
        ...ce,
        {
          id,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        },
      ]);
      if (F) {
        setU(id);
      }
      while (true) {
        const { done, value } = await ie.read();
        if (done) {
          break;
        }
        T += J.decode(value, {
          stream: true,
        });
        let le;
        while (
          (le = T.indexOf(`
`)) !== -1
        ) {
          let H = T.slice(0, le);
          T = T.slice(le + 1);
          if (H.endsWith("\r")) {
            H = H.slice(0, -1);
          }
          if (H.startsWith(":") || H.trim() === "" || !H.startsWith("data: ")) {
            continue;
          }
          const ye = H.slice(6).trim();
          if (ye === "[DONE]") {
            break;
          }
          try {
            const Z = JSON.parse(ye);
            if (Z.type === "attachments") {
              console.log("Received attachments from server:", Z.attachments);
              j = Z.attachments || [];
              setP((K) =>
                K.map((D) => {
                  if (D.id === id) {
                    return {
                      ...D,
                      attachments: j,
                    };
                  }
                  return D;
                }),
              );
              continue;
            }
            if (Z.type === "title_update") {
              const title = Z.title;
              const D = Z.conversationId ?? r;
              setS((De) =>
                De.map((de) => {
                  if (de.id === D) {
                    return {
                      ...de,
                      title,
                    };
                  }
                  return de;
                }),
              );
              continue;
            }
            const be = Z.choices?.[0]?.delta?.content;
            if (be) {
              content += be;
              setP((K) =>
                K.map((D) => {
                  if (D.id === id) {
                    return {
                      ...D,
                      content,
                    };
                  }
                  return D;
                }),
              );
            }
          } catch {
            T =
              H +
              `
` +
              T;
            break;
          }
        }
      }
      if (j.length > 0) {
        console.log("Received attachments from stream:", j);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t("chat.err.sendMessage"));
    } finally {
      setY(false);
    }
  };
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar
        conversations={s}
        currentConversation={r}
        onSelectConversation={onSelectConversation}
        onNewConversation={m}
        onDeleteConversation={onDeleteConversation}
        hideMobileTabs={p.length > 0}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar
          title="ALMA"
          leading={{
            icon: iconMenu,
            label: t("nav.menu"),
            onClick: o.open,
          }}
          actions={[
            {
              icon: iconEdit,
              label: t("chat.newChat"),
              onClick: m,
            },
          ]}
        />
        {p.length === 0 && !y ? (
          <>
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <div className="flex w-full max-w-[786px] flex-col gap-[42px]">
                <div className="flex flex-col items-center gap-4 text-center">
                  {te && (
                    <p className="font-body text-[22px] font-semibold tracking-[0.22px] text-alma-accent-ring/80 sm:text-[32px] sm:tracking-[0.32px]">
                      Hello, {te}
                    </p>
                  )}
                  <h1 className="font-display text-[28px] font-bold leading-tight tracking-[0.28px] text-alma-ink/70 sm:text-[42px] sm:tracking-[0.42px]">
                    {t("chat.empty")}
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center gap-3">
                  <V21 onPick={setValue} />
                  <p className="max-w-[300px] text-center font-body text-[12.5px] leading-4 tracking-[0.25px] text-alma-faint">
                    {t("chat.orJustType")}
                  </p>
                  {v.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {v.map((a, i) => (
                        <div
                          key={i}
                          className="relative group flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border"
                        >
                          {a.type.startsWith("image/") ? (
                            <img src={a.url} alt="attachment" className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded">
                              <Paperclip className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground max-w-[100px] truncate">
                            {a.type.split("/")[0]}
                          </span>
                          <button
                            onClick={() => setV(v.filter((d, w) => w !== i))}
                            className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <NeComponent
                    value={value}
                    onChange={setValue}
                    onSubmit={onSubmit}
                    disabled={y}
                    fileUpload={
                      <SeComponent
                        icon={<img src={Ae} alt="" className="h-6 w-6" />}
                        className="rounded-full transition-opacity hover:opacity-70 disabled:opacity-50"
                        onFileUploaded={(a, i) => {
                          setV([
                            ...v,
                            {
                              url: a,
                              type: i,
                            },
                          ]);
                          toast.success(t("chat.ok.fileAttached"));
                        }}
                      />
                    }
                    voiceRecorder={
                      <VeComponent
                        icon={<img src={Te} alt="" className="h-6 w-6" />}
                        className="rounded-full transition-opacity hover:opacity-70 disabled:opacity-50"
                        onTranscription={(a) => {
                          setValue(a);
                          fRef.current = true;
                        }}
                      />
                    }
                  />
                </div>
              </div>
            </div>
            <div className="px-6 pb-8">
              <V2Component />
            </div>
          </>
        ) : (
          <>
            <M2Component
              title={s.find((a) => a.id === r)?.title || "New Conversation"}
              searchOpen={searchOpen}
              query={P}
              onQueryChange={setP_1}
              onToggleSearch={() => {
                setSearchOpen((a) => !a);
                setP_1("");
              }}
              onCopyTranscript={async () => {
                const a = s.find((d) => d.id === r)?.title || "Conversation";
                try {
                  await navigator.clipboard.writeText(d2(a, p));
                  toast.success(t("chat.ok.transcriptCopied"));
                } catch {
                  toast.error(t("chat.err.copyTranscript"));
                }
              }}
              onNewChat={m}
              onDelete={r ? () => onDeleteConversation(r) : undefined}
            />
            <ScrollArea className="flex-1" ref={RRef}>
              <div className="mx-auto max-w-[786px] px-4 sm:px-6 pb-6">
                {l2(_e(p, P), (a) => a.createdAt, new Date()).map((a) => (
                  <div key={a.key}>
                    <div className="flex items-center gap-3.5 py-6">
                      <span className="h-px flex-1 bg-[rgba(23,50,77,0.1)]" />
                      <span className="font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.42)]">
                        {a.label}
                      </span>
                      <span className="h-px flex-1 bg-[rgba(23,50,77,0.1)]" />
                    </div>
                    {a.items.map((i) => (
                      <M21
                        key={i.id}
                        role={i.role}
                        content={i.content}
                        createdAt={i.createdAt}
                        attachments={i.attachments}
                        suggestions={i.suggestions}
                        vaultRef={i.vaultRef}
                        onPickSuggestion={(d) => onSubmit(d)}
                        isEditing={A === i.id}
                        onStartEdit={() => setA(i.id)}
                        onCancelEdit={() => setA(null)}
                        onEdit={(d) => B(i.id, d)}
                        autoPlay={i.id === u}
                      />
                    ))}
                  </div>
                ))}
                {P && _e(p, P).length === 0 && (
                  <p className="py-10 text-center font-body text-sm text-[rgba(23,50,77,0.45)]">
                    Nothing in this conversation matches “{P}”.
                  </p>
                )}
                {y && (
                  <div className="flex items-center gap-[9px] py-3 animate-in fade-in">
                    <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-deep font-body text-xs font-semibold text-white">
                      A
                    </span>
                    <span
                      className="flex h-8 items-center gap-1.5 rounded-full border border-[rgba(23,50,77,0.1)] bg-white/95 px-4"
                      role="status"
                      aria-label={t("chat.typing")}
                    >
                      {[0, 150, 300].map((a) => (
                        <span
                          key={a}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-alma-accent-deep"
                          style={{
                            animationDelay: `${a}ms`,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                )}
                <div ref={ref} />
              </div>
            </ScrollArea>
            <div className="bg-alma-canvas">
              <div className="mx-auto max-w-[786px] space-y-3 px-4 sm:px-6 pb-8 pt-2">
                {v.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {v.map((a, i) => (
                      <div
                        key={i}
                        className="relative group flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border"
                      >
                        {a.type.startsWith("image/") ? (
                          <img src={a.url} alt="attachment" className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded">
                            <Paperclip className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground max-w-[100px] truncate">
                          {a.type.split("/")[0]}
                        </span>
                        <button
                          onClick={() => setV(v.filter((d, w) => w !== i))}
                          className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <NeComponent
                  value={value}
                  onChange={setValue}
                  onSubmit={onSubmit}
                  disabled={y}
                  fileUpload={
                    <SeComponent
                      icon={<img src={Ae} alt="" className="h-6 w-6" />}
                      className="rounded-full transition-opacity hover:opacity-70 disabled:opacity-50"
                      onFileUploaded={(a, i) => {
                        setV([
                          ...v,
                          {
                            url: a,
                            type: i,
                          },
                        ]);
                        toast.success(t("chat.ok.fileAttached"));
                      }}
                    />
                  }
                  voiceRecorder={
                    <VeComponent
                      icon={<img src={Te} alt="" className="h-6 w-6" />}
                      className="rounded-full transition-opacity hover:opacity-70 disabled:opacity-50"
                      onTranscription={(a) => {
                        setValue(a);
                        fRef.current = true;
                      }}
                    />
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
