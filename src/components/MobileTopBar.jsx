import { cn } from "@/lib/utils";

function TopBarAction({ action }) {
  return (
    <button
      type="button"
      onClick={action.onClick}
      aria-label={action.label}
      className="flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-alma-panel/50"
    >
      <img src={action.icon} alt="" className="size-[22px]" />
    </button>
  );
}
export function MobileTopBar({ title, subtitle, leading, actions, className }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-1 bg-alma-canvas/95 px-2.5 backdrop-blur md:hidden",
        className,
      )}
    >
      {leading && <TopBarAction action={leading} />}
      <div className="flex min-w-0 flex-1 flex-col gap-px ps-0.5">
        <h1 className="truncate font-display text-[15px] font-semibold leading-[21px] tracking-[0.15px] text-alma-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate font-body text-[11px] leading-4 tracking-[0.22px] text-alma-faint">{subtitle}</p>
        )}
      </div>
      {actions?.map((action) => (
        <TopBarAction key={action.label} action={action} />
      ))}
    </header>
  );
}
