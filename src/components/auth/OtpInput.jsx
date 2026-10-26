import React from "react";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;
export default function OtpInput({ id, value, onChange, disabled, autoFocus, ...rest }) {
  const oRef = React.useRef(null);
  const a = value.padEnd(CODE_LENGTH).slice(0, CODE_LENGTH).split("");
  const l = Math.min(value.length, CODE_LENGTH - 1);
  return (
    <div className="relative w-full" onClick={() => oRef.current?.focus()}>
      <input
        ref={oRef}
        id={id}
        type="text"
        inputMode="numeric"
        dir="ltr"
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        disabled={disabled}
        maxLength={CODE_LENGTH}
        value={value}
        onChange={(c) => onChange(c.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))}
        className="absolute inset-0 z-10 h-full w-full cursor-default opacity-0"
        {...rest}
      />
      <div className="flex w-full items-start gap-2" aria-hidden>
        {a.map((c, d) => {
          const h = c.trim() !== "";
          const f = !disabled && d === l && !h;
          return (
            <div
              key={d}
              className={cn(
                "flex h-[62px] min-w-0 flex-1 items-center justify-center rounded-[14px] transition-colors",
                h && "border border-[#9cc3de] bg-alma-soft",
                f && "border-2 border-[#9cc3de] bg-alma-surface",
                !h && !f && "border border-alma-line bg-alma-surface",
              )}
            >
              {h ? (
                <span className="font-body text-2xl font-semibold text-alma-ink">{c}</span>
              ) : f ? (
                <span className="h-[26px] w-0.5 animate-pulse rounded-[1px] bg-alma-action" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
