import { cn } from "@/lib/utils";

export function MobileSegmented({ segments, value, onChange, className, ...rest }) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex h-11 w-full items-stretch gap-[3px] rounded-full border border-alma-hairline bg-alma-sunken p-[3px]",
        className,
      )}
      {...rest}
    >
      {segments.map((r) => {
        const o = r.value === value;
        return (
          <button
            key={r.value}
            type="button"
            role="tab"
            aria-selected={o}
            onClick={() => onChange(r.value)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-[7px] rounded-full transition-colors",
              o ? "bg-alma-panel" : "hover:bg-alma-panel/40",
            )}
          >
            {r.icon && <img src={r.icon} alt="" className="size-4 shrink-0" />}
            <span
              className={cn(
                "truncate font-body text-[13px] font-medium leading-[18px] tracking-[0.26px]",
                o ? "text-alma-ink" : "text-alma-muted",
              )}
            >
              {r.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
