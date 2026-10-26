import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SettingsCard({ title, description, children, className }) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-3.5 rounded-[18px] border border-[rgba(23,50,77,0.1)] bg-white/[0.94] p-[22px] shadow-[0px_3px_12px_0px_rgba(23,50,77,0.05)]",
        className,
      )}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1.5">
          {title && <h2 className="font-display text-[15px] font-semibold tracking-[0.15px] text-alma-ink">{title}</h2>}
          {description && (
            <p className="font-body text-xs leading-[18px] tracking-[0.12px] text-[rgba(23,50,77,0.55)]">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
export function SettingsRow({ label, hint, labelClassName, children }) {
  return (
    <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p
          className={cn(
            "font-body text-[13px] font-medium tracking-[0.26px] text-[rgba(23,50,77,0.95)]",
            labelClassName,
          )}
        >
          {label}
        </p>
        {hint && <p className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.5)]">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
export function SettingsSwitch({ checked, onCheckedChange, label }) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      className="shrink-0 data-[state=checked]:bg-alma-accent-deep"
    />
  );
}
export function PrimaryPill({ children, ...rest }) {
  return (
    <button
      {...rest}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-4 py-2.5",
        "font-body text-[12.5px] font-medium tracking-[0.25px] text-white",
        "shadow-[0px_3px_10px_0px_rgba(40,94,133,0.14)] transition-opacity hover:opacity-90",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
        "disabled:cursor-not-allowed disabled:opacity-60",
        rest.className,
      )}
    >
      {children}
    </button>
  );
}
export function GhostPill({ children, ...rest }) {
  return (
    <button
      {...rest}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border border-[rgba(23,50,77,0.12)] bg-[#eaf3fa] px-4 py-2.5",
        "font-body text-[12.5px] font-medium tracking-[0.25px] text-[rgba(23,50,77,0.85)]",
        "transition-colors hover:bg-white",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
        "disabled:cursor-not-allowed disabled:opacity-60",
        rest.className,
      )}
    >
      {children}
    </button>
  );
}
export function DangerPill({ children, ...rest }) {
  return (
    <button
      {...rest}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border border-[rgba(179,38,30,0.25)] bg-[#fdf1f0] px-4 py-2.5",
        "font-body text-[12.5px] font-medium tracking-[0.25px] text-[#b3261e]",
        "transition-colors hover:bg-[#fbe6e4]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b3261e]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        rest.className,
      )}
    >
      {children}
    </button>
  );
}
export function ReadonlyField({ children, className }) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center rounded-[12px] border border-[rgba(23,50,77,0.12)] bg-alma-field px-3.5 py-3",
        "font-body text-[13px] tracking-[0.26px] text-[rgba(23,50,77,0.9)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
export const iconTrash =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/trash'%3e%3cpath%20id='Vector'%20d='M1.875%203.75H13.125M5%203.75V2.5H10V3.75M11.875%203.75L11.25%2012.5H3.75L3.125%203.75'%20stroke='%23B3261E'%20stroke-opacity='0.8'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
