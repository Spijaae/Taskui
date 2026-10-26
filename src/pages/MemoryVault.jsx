import { ChevronUp, ChevronDown } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileTopBar } from "@/components/MobileTopBar";
import { useSearchPalette } from "@/components/SearchPalette";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconMenu, iconSearchLarge } from "@/lib/appIcons";
import { matchesQuery, relativeAge, splitTitle, firstNonEmpty, formatMemoryDate } from "@/lib/memories";
import { cn } from "@/lib/utils";

const iconChev =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/chev'%3e%3cpath%20id='Vector'%20d='M6%2012L10%208L6%204'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%2317324D'%20stroke-opacity='0.5'/%3e%3c/g%3e%3c/svg%3e";
function HComponent({ icon, title, count, onOpen, empty, children, className }) {
  const { locale } = useI18n();
  const L = !!children;
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-3 overflow-hidden rounded-[18px] border border-alma-hairline bg-alma-surface pb-3.5 shadow-[0px_2px_8px_0px_rgba(23,41,61,0.05)]",
        className,
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        disabled={!onOpen}
        className="flex w-full items-center gap-2.5 bg-alma-soft px-3.5 py-[13px] text-start transition-colors enabled:hover:bg-alma-soft/70"
      >
        <img src={icon} alt="" className="size-[18px] shrink-0" />
        <span className="font-body text-sm font-medium leading-5 tracking-[0.28px] text-alma-ink">{title}</span>
        {typeof count === "number" && (
          <span className="shrink-0 rounded-full bg-alma-surface px-2 py-[3px] font-body text-[11px] leading-4 tracking-[0.22px] text-alma-ink">
            {count.toLocaleString(locale)}
          </span>
        )}
        <span className="min-w-0 flex-1" />
        {onOpen && <img src={iconChev} alt="" className="size-4 shrink-0 rtl:-scale-x-100" />}
      </button>
      <div className="flex flex-col gap-2.5 px-3.5 pt-1">
        {L ? (
          children
        ) : (
          <p className="py-2 font-body text-[12.5px] leading-[18px] tracking-[0.25px] text-alma-faint">{empty}</p>
        )}
      </div>
    </section>
  );
}
function KComponent({ children, className, onClick }) {
  const L = onClick ? "button" : "div";
  return (
    <L
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-[7px] rounded-[14px] border border-alma-hairline bg-alma-subtle px-[13px] py-3 text-start",
        onClick && "transition-colors hover:bg-alma-soft/50",
        className,
      )}
    >
      {children}
    </L>
  );
}
const iconBrain =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/brain'%3e%3cpath%20id='Vector'%20d='M9%203.75C8.86162%203.22557%208.53845%202.76877%208.09%202.46371C7.64154%202.15864%207.09798%202.02583%206.55937%202.08973C6.02077%202.15364%205.52338%202.40995%205.15875%202.81148C4.79413%203.21301%204.58683%203.73275%204.575%204.275C3.94843%204.06614%203.26455%204.11474%202.67381%204.41011C2.08307%204.70548%201.63386%205.22343%201.425%205.85C1.21614%206.47657%201.26474%207.16045%201.56011%207.75119C1.85548%208.34193%202.37343%208.79114%203%209C2.66534%209.31007%202.43285%209.71454%202.33336%2010.1598C2.23387%2010.605%202.27207%2011.07%202.44291%2011.493C2.61375%2011.916%202.90914%2012.2771%203.28992%2012.5284C3.6707%2012.7797%204.11888%2012.9093%204.575%2012.9C4.39598%2013.4868%204.45739%2014.1207%204.74573%2014.6622C5.03407%2015.2037%205.52571%2015.6085%206.1125%2015.7875C6.69929%2015.9665%207.33317%2015.9051%207.87468%2015.6168C8.41619%2015.3284%208.82098%2014.8368%209%2014.25V3.75Z'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'%20stroke-opacity='0.9'/%3e%3cpath%20id='Vector_2'%20d='M9%203.75C9.13838%203.22557%209.46155%202.76877%209.91%202.46371C10.3585%202.15864%2010.902%202.02583%2011.4406%202.08973C11.9792%202.15364%2012.4766%202.40995%2012.8412%202.81148C13.2059%203.21301%2013.4132%203.73275%2013.425%204.275C14.0516%204.06614%2014.7355%204.11474%2015.3262%204.41011C15.9169%204.70548%2016.3661%205.22343%2016.575%205.85C16.7839%206.47657%2016.7353%207.16045%2016.4399%207.75119C16.1445%208.34193%2015.6266%208.79114%2015%209C15.3347%209.31007%2015.5671%209.71454%2015.6666%2010.1598C15.7661%2010.605%2015.7279%2011.07%2015.5571%2011.493C15.3863%2011.916%2015.0909%2012.2771%2014.7101%2012.5284C14.3293%2012.7797%2013.8811%2012.9093%2013.425%2012.9C13.604%2013.4868%2013.5426%2014.1207%2013.2543%2014.6622C12.9659%2015.2037%2012.4743%2015.6085%2011.8875%2015.7875C11.3007%2015.9665%2010.6668%2015.9051%2010.1253%2015.6168C9.58381%2015.3284%209.17902%2014.8368%209%2014.25V3.75Z'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'%20stroke-opacity='0.9'/%3e%3c/g%3e%3c/svg%3e";
const iconBell =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/bell'%3e%3cpath%20id='Vector'%20d='M4.5%206C4.5%204.80653%204.97411%203.66193%205.81802%202.81802C6.66193%201.97411%207.80653%201.5%209%201.5C10.1935%201.5%2011.3381%201.97411%2012.182%202.81802C13.0259%203.66193%2013.5%204.80653%2013.5%206C13.5%2011.25%2015.75%2012.75%2015.75%2012.75H2.25C2.25%2012.75%204.5%2011.25%204.5%206Z'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'%20stroke-opacity='0.9'/%3e%3cpath%20id='Vector_2'%20d='M7.725%2015.75C7.85953%2015.9671%208.04724%2016.1462%208.27036%2016.2704C8.49349%2016.3946%208.74463%2016.4598%209%2016.4598C9.25537%2016.4598%209.50651%2016.3946%209.72964%2016.2704C9.95276%2016.1462%2010.1405%2015.9671%2010.275%2015.75'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'%20stroke-opacity='0.9'/%3e%3c/g%3e%3c/svg%3e";
const iconImg =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/img'%3e%3cpath%20id='Vector'%20d='M4.5%202.25H13.5C14.7426%202.25%2015.75%203.25736%2015.75%204.5V13.5C15.75%2014.7426%2014.7426%2015.75%2013.5%2015.75H4.5C3.25736%2015.75%202.25%2014.7426%202.25%2013.5V4.5C2.25%203.25736%203.25736%202.25%204.5%202.25Z'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'%20stroke-opacity='0.9'/%3e%3cpath%20id='Vector_2'%20d='M7.725%206.375C7.725%207.12058%207.12058%207.725%206.375%207.725C5.62942%207.725%205.025%207.12058%205.025%206.375C5.025%205.62942%205.62942%205.025%206.375%205.025C7.12058%205.025%207.725%205.62942%207.725%206.375Z'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'%20stroke-opacity='0.9'/%3e%3cpath%20id='Vector_3'%20d='M15.75%2011.25L12%207.5L5.25%2014.25'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'%20stroke-opacity='0.9'/%3e%3c/g%3e%3c/svg%3e";
const S2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%20clip-path='url(%23clip0_0_608)'%3e%3cpath%20id='Vector'%20d='M8%2014.6667C11.6819%2014.6667%2014.6667%2011.6819%2014.6667%208C14.6667%204.3181%2011.6819%201.33333%208%201.33333C4.3181%201.33333%201.33333%204.3181%201.33333%208C1.33333%2011.6819%204.3181%2014.6667%208%2014.6667Z'%20stroke='%2317324d'%20stroke-opacity='0.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-dasharray='3%203'/%3e%3cpath%20id='Vector_2'%20d='M5.33333%208H10.6667'%20stroke='%2317324d'%20stroke-opacity='0.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M8%205.33333V10.6667'%20stroke='%2317324d'%20stroke-opacity='0.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_608'%3e%3crect%20width='16'%20height='16'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const R2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='plus'%3e%3cpath%20id='Vector'%20d='M8%203.33333V12.6667'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M3.33333%208H12.6667'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
function VComponent({ icon, title, actionLabel, onAction, onHeaderAction, children, className }) {
  return (
    <section
      className={cn(
        "flex w-[270px] shrink-0 flex-col overflow-hidden rounded-[12px] border border-[#d5e2ec] bg-[#f6f9fc]",
        className,
      )}
    >
      <header className="flex h-[45px] shrink-0 items-center justify-between border-b border-[rgba(213,226,236,0.7)] bg-[#f6f9fc] px-[13px]">
        <div className="flex min-w-0 items-center gap-1.5">
          <img src={icon} alt="" className="h-4 w-4 shrink-0" />
          <h2 className="truncate font-body text-base font-medium tracking-[0.32px] text-alma-ink">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onHeaderAction ?? onAction}
          aria-label={actionLabel}
          className="shrink-0 rounded-full transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
        >
          <img src={S2} alt="" className="h-4 w-4" />
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-2.5">{children}</div>
      <button
        type="button"
        onClick={onAction}
        className="flex shrink-0 items-center justify-center gap-1.5 px-3 pb-4 pt-1 font-body text-[10px] tracking-[0.2px] text-[rgba(23,50,77,0.6)] transition-colors hover:text-[rgba(23,50,77,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
      >
        <img src={R2} alt="" className="h-4 w-4" />
        {actionLabel}
      </button>
    </section>
  );
}
function TComponent({ children, onClick, className }) {
  const className_1 = cn(
    "w-full rounded-[6px] border-[0.5px] border-[#d5e2ec] bg-white/40 p-2.5 text-start",
    onClick && "transition-colors hover:border-alma-accent-deep",
    className,
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className_1}>
        {children}
      </button>
    );
  }
  return <div className={className_1}>{children}</div>;
}
function OComponent({ tag, age }) {
  if (!tag && !age) {
    return null;
  }
  return (
    <div className="mt-2.5 flex items-center justify-between gap-2">
      {tag ? (
        <span className="max-w-[140px] truncate rounded-[24px] border-[0.5px] border-[rgba(23,50,77,0.2)] px-2 py-1 font-body text-[10px] font-light tracking-[0.1px] text-[rgba(23,50,77,0.7)]">
          {tag}
        </span>
      ) : (
        <span />
      )}
      {age && <span className="shrink-0 font-body text-[10px] tracking-[0.2px] text-[rgba(23,50,77,0.6)]">{age}</span>}
    </div>
  );
}
function MComponent({ children }) {
  return (
    <p className="px-2 py-6 text-center font-body text-[11px] leading-relaxed text-[rgba(23,50,77,0.45)]">{children}</p>
  );
}
const B2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M14%2014L11.1067%2011.1067'%20stroke='%23526779'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M7.33333%2012.6667C10.2789%2012.6667%2012.6667%2010.2789%2012.6667%207.33333C12.6667%204.38781%2010.2789%202%207.33333%202C4.38781%202%202%204.38781%202%207.33333C2%2010.2789%204.38781%2012.6667%207.33333%2012.6667Z'%20stroke='%23526779'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const E2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='12'%20height='12'%20viewBox='0%200%2012%2012'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M6%2010.5C8.20914%2010.5%2010%208.70914%2010%206.5C10%204.29086%208.20914%202.5%206%202.5C3.79086%202.5%202%204.29086%202%206.5C2%208.70914%203.79086%2010.5%206%2010.5Z'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M2.5%201.5L1%203'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M11%203L9.5%201.5'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M3.19%209.35L2%2010.5'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M8.82%209.335L10%2010.5'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_6'%20d='M6%205V8'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_7'%20d='M4.5%206.5H7.5'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const I2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%20clip-path='url(%23clip0_0_336)'%3e%3cpath%20id='Vector'%20d='M8%2012V3.33333'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M10%208.66667C9.4232%208.49806%208.91656%208.14708%208.556%207.66633C8.19544%207.18558%208.00036%206.60094%208%206C7.99964%206.60094%207.80456%207.18558%207.444%207.66633C7.08344%208.14708%206.5768%208.49806%206%208.66667'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M11.732%204.33333C11.8854%204.06766%2011.9756%203.77025%2011.9957%203.46413C12.0158%203.158%2011.9652%202.85136%2011.8478%202.56793C11.7304%202.28449%2011.5494%202.03187%2011.3187%201.82959C11.0881%201.62731%2010.814%201.4808%2010.5176%201.4014C10.2213%201.32199%209.91069%201.31183%209.6098%201.37168C9.30891%201.43153%209.02583%201.5598%208.78244%201.74656C8.53906%201.93333%208.3419%202.17358%208.20623%202.44873C8.07055%202.72388%207.99999%203.02655%208%203.33333C8.00001%203.02655%207.92945%202.72388%207.79377%202.44873C7.6581%202.17358%207.46094%201.93333%207.21756%201.74656C6.97417%201.5598%206.69109%201.43153%206.3902%201.37168C6.08931%201.31183%205.77868%201.32199%205.48236%201.4014C5.18603%201.4808%204.91193%201.62731%204.68129%201.82959C4.45064%202.03187%204.26961%202.28449%204.15222%202.56793C4.03483%202.85136%203.98421%203.158%204.00429%203.46413C4.02436%203.77025%204.11459%204.06766%204.268%204.33333'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M11.998%203.41667C12.3899%203.51742%2012.7537%203.70603%2013.0618%203.96821C13.37%204.23038%2013.6145%204.55925%2013.7768%204.9299C13.939%205.30055%2014.0148%205.70326%2013.9984%206.10754C13.982%206.51182%2013.8738%206.90706%2013.682%207.26333'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M12%2012C12.587%2012%2013.1576%2011.8063%2013.6233%2011.4489C14.089%2011.0916%2014.4238%2010.5905%2014.5757%2010.0235C14.7276%209.45653%2014.6882%208.85524%2014.4636%208.31291C14.239%207.77058%2013.8417%207.31753%2013.3333%207.024'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_6'%20d='M13.3113%2011.6553C13.3581%2012.0168%2013.3302%2012.3841%2013.2294%2012.7343C13.1286%2013.0846%2012.9571%2013.4106%2012.7255%2013.692C12.4938%2013.9734%2012.2069%2014.2043%2011.8825%2014.3705C11.5581%2014.5367%2011.2031%2014.6346%2010.8393%2014.6582C10.4756%2014.6818%2010.1109%2014.6306%209.76774%2014.5077C9.42458%2014.3849%209.11025%2014.193%208.84416%2013.9438C8.57807%2013.6947%208.36588%2013.3937%208.22069%2013.0594C8.0755%2012.725%208.00039%2012.3645%208%2012C7.99961%2012.3645%207.9245%2012.725%207.77931%2013.0594C7.63412%2013.3937%207.42193%2013.6947%207.15584%2013.9438C6.88975%2014.193%206.57542%2014.3849%206.23226%2014.5077C5.88909%2014.6306%205.52438%2014.6818%205.16065%2014.6582C4.79692%2014.6346%204.44189%2014.5367%204.11748%2014.3705C3.79307%2014.2043%203.50618%2013.9734%203.27452%2013.692C3.04286%2013.4106%202.87136%2013.0846%202.77059%2012.7343C2.66983%2012.3841%202.64194%2012.0168%202.68867%2011.6553'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_7'%20d='M4%2012C3.413%2012%202.8424%2011.8063%202.37671%2011.4489C1.91102%2011.0916%201.57625%2010.5905%201.42432%2010.0235C1.27239%209.45653%201.31179%208.85524%201.53641%208.31291C1.76103%207.77058%202.15832%207.31753%202.66667%207.024'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_8'%20d='M4.002%203.41667C3.61013%203.51742%203.24633%203.70603%202.93815%203.96821C2.62997%204.23038%202.38549%204.55925%202.22323%204.9299C2.06097%205.30055%201.98517%205.70326%202.00159%206.10754C2.01801%206.51182%202.12621%206.90706%202.318%207.26333'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_336'%3e%3crect%20width='16'%20height='16'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const H2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M6.84533%2014C6.96236%2014.2027%207.13068%2014.371%207.33336%2014.488C7.53605%2014.605%207.76596%2014.6666%208%2014.6666C8.23404%2014.6666%208.46395%2014.605%208.66664%2014.488C8.86932%2014.371%209.03764%2014.2027%209.15467%2014'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M7.78667%201.33933C6.76424%201.39394%205.80168%201.83854%205.09723%202.58156C4.39278%203.32458%204.00008%204.30945%204%205.33333C4%208.33267%203.05933%209.304%202.17467%2010.2173C2.08758%2010.3128%202.0301%2010.4315%202.00924%2010.559C1.98837%2010.6865%202.00501%2010.8174%202.05714%2010.9356C2.10926%2011.0538%202.19462%2011.1544%202.30284%2011.225C2.41105%2011.2956%202.53745%2011.3332%202.66667%2011.3333H13.3333C13.4625%2011.3334%2013.589%2011.2959%2013.6972%2011.2254C13.8055%2011.1549%2013.891%2011.0545%2013.9433%2010.9363C13.9955%2010.8182%2014.0123%2010.6874%2013.9916%2010.5599C13.9709%2010.4323%2013.9136%2010.3136%2013.8267%2010.218C13.2773%209.65133%2012.708%209.064%2012.3533%207.986'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M12%205.33333C13.1046%205.33333%2014%204.4379%2014%203.33333C14%202.22876%2013.1046%201.33333%2012%201.33333C10.8954%201.33333%2010%202.22876%2010%203.33333C10%204.4379%2010.8954%205.33333%2012%205.33333Z'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const T2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M8.66667%203.33333H14'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M8.66667%208H14'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M8.66667%2012.6667H14'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M2%2011.3333L3.33333%2012.6667L6%2010'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M2%204.66667L3.33333%206L6%203.33333'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const Z2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M4%2014.6667C3.64638%2014.6667%203.30724%2014.5262%203.05719%2014.2761C2.80714%2014.0261%202.66667%2013.687%202.66667%2013.3333V2.66667C2.66667%202.31304%202.80714%201.97391%203.05719%201.72386C3.30724%201.47381%203.64638%201.33333%204%201.33333H9.33333C9.54437%201.33299%209.75339%201.3744%209.94835%201.45518C10.1433%201.53596%2010.3204%201.65451%2010.4693%201.804L12.8613%204.196C13.0112%204.345%2013.1301%204.52223%2013.2111%204.71744C13.2921%204.91265%2013.3337%205.12198%2013.3333%205.33333V13.3333C13.3333%2013.687%2013.1929%2014.0261%2012.9428%2014.2761C12.6928%2014.5262%2012.3536%2014.6667%2012%2014.6667H4Z'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M9.33333%201.33333V4.66667C9.33333%204.84348%209.40357%205.01305%209.5286%205.13807C9.65362%205.2631%209.82319%205.33333%2010%205.33333H13.3333'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M6.66667%209.33333C7.40305%209.33333%208%208.73638%208%208C8%207.26362%207.40305%206.66667%206.66667%206.66667C5.93029%206.66667%205.33333%207.26362%205.33333%208C5.33333%208.73638%205.93029%209.33333%206.66667%209.33333Z'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M13.3333%2011.3333L12.4693%2010.4693C12.168%2010.1681%2011.7594%209.99884%2011.3333%209.99884C10.9073%209.99884%2010.4986%2010.1681%2010.1973%2010.4693L6%2014.6667'%20stroke='%235c92b8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
export default function MemoryVault() {
  const { t } = useI18n();
  const n = useMobileNav();
  const c = useSearchPalette();
  const [l, setL] = React.useState([]);
  const [x, setX] = React.useState([]);
  const [m, setM] = React.useState("");
  const [f, setF] = React.useState(null);
  const [q, setQ] = React.useState(true);
  const [Y, setY] = React.useState([]);
  const [_, set_] = React.useState([]);
  const [F, setF_1] = React.useState([]);
  const [A, setA] = React.useState(null);
  const [N, setN] = React.useState({});
  const [o2, setO2] = React.useState([]);
  const [k, setK] = React.useState(null);
  const [Q, setQ_1] = React.useState({});
  const [r2, setR2] = React.useState([]);
  const v = useNavigate();
  const U = React.useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t("vault.err.login"));
        setQ(false);
        return;
      }
      const [{ data, error }, { data: data_1 }, { data: data_2 }] = await Promise.all([
        supabase.from("memories").select("*").eq("user_id", user.id).order("timestamp", {
          ascending: false,
        }),
        supabase
          .from("reminders")
          .select("id, event_name, event_description, event_date, reminder_time, reminder_sent")
          .eq("user_id", user.id)
          .eq("reminder_sent", false)
          .order("event_date", {
            ascending: true,
          }),
        supabase.from("user_lists").select("id, list_name").eq("user_id", user.id).order("list_name", {
          ascending: true,
        }),
      ]);
      if (error) {
        throw error;
      }
      setL(data || []);
      const G = new Set();
      (data ?? []).forEach((a) => {
        a.tags?.forEach((h) => G.add(h));
      });
      setY(Array.from(G));
      set_(data_1 ?? []);
      const [{ data: data_3 }, { data: data_4 }] = await Promise.all([
        supabase.from("vaults").select("id, name, cover_url").eq("user_id", user.id).order("name", {
          ascending: true,
        }),
        supabase.from("vault_items").select("vault_id, memory_id").eq("user_id", user.id),
      ]);
      const j = {};
      (data_4 ?? []).forEach((a) => {
        var p;
        (j[(p = a.vault_id)] ?? (j[p] = [])).push(a.memory_id);
      });
      setQ_1(j);
      setO2(
        (data_3 ?? []).map((a) => ({
          ...a,
          count: j[a.id]?.length ?? 0,
        })),
      );
      const m2 = new Set(
        (data ?? []).flatMap((a) => {
          const p = a?.metadata?.gallery_image_id;
          if (typeof p === "string") {
            return [p];
          }
          return [];
        }),
      );
      const { data: data_5 } = await supabase
        .from("gallery_images")
        .select("id, file_url, file_name")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });
      setR2(
        (data_5 ?? [])
          .filter((a) => !m2.has(a.id))
          .map((a) => ({
            id: a.id,
            url: a.file_url,
            title: a.file_name ?? "Gallery photo",
          })),
      );
      const E = data_2 ?? [];
      if (E.length === 0) {
        setF_1([]);
      } else {
        const a = E.map((g) => g.id);
        const { data: data_6 } = await supabase
          .from("list_items")
          .select("list_id, is_completed")
          .eq("user_id", user.id)
          .in("list_id", a);
        const h = new Map();
        (data_6 ?? []).forEach((g) => {
          if (!g.is_completed) {
            h.set(g.list_id, (h.get(g.list_id) ?? 0) + 1);
          }
        });
        setF_1(
          E.map((g) => ({
            ...g,
            openCount: h.get(g.id) ?? 0,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching memories:", error);
      toast.error(t("vault.err.load"));
    } finally {
      setQ(false);
    }
  }, [t]);
  const l2 = async (e) => {
    if (N[e]) {
      setA(A === e ? null : e);
      return;
    }
    const { data } = await supabase
      .from("list_items")
      .select("id, title, is_completed")
      .eq("list_id", e)
      .order("sort_order", {
        ascending: true,
      });
    setN((i) => ({
      ...i,
      [e]: data ?? [],
    }));
    setA(e);
  };
  const c2 = [
    ...l.flatMap((e) => {
      const o = e.metadata?.attachments ?? [];
      if (Array.isArray(o)) {
        return o
          .filter((d) => typeof d?.type === "string" && d.type.startsWith("image/"))
          .map((d) => ({
            id: `${e.id}-${d.url}`,
            url: d.url,
            memoryContent: e.content ?? "",
          }));
      }
      return [];
    }),
    ...r2.map((e) => ({
      id: `gallery-${e.id}`,
      url: e.url,
      memoryContent: e.title,
    })),
  ];
  const W = React.useCallback(() => {
    let e = l;
    if (m) {
      e = e.filter(
        (o) =>
          o.content?.toLowerCase().includes(m.toLowerCase()) ||
          o.tags?.some((B) => B.toLowerCase().includes(m.toLowerCase())),
      );
    }
    if (f) {
      e = e.filter((o) => o.tags?.includes(f));
    }
    if (k) {
      const o = new Set(Q[k] ?? []);
      e = e.filter((i) => o.has(i.id));
    }
    setX(e);
  }, [l, m, f, k, Q]);
  React.useEffect(() => {
    U();
  }, [U]);
  React.useEffect(() => {
    W();
  }, [W]);
  const S = new Date();
  const y = c2.filter((e) => matchesQuery(m, e.memoryContent));
  const RComponent = (e, o, onClick, key) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[24px] px-4 py-1.5 font-body text-xs tracking-[0.12px] text-[rgba(23,50,77,0.9)] opacity-80 transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
        o
          ? "border-[0.5px] border-solid border-[rgba(23,50,77,0.2)] bg-alma-panel"
          : "border-[0.5px] border-dashed border-[rgba(23,50,77,0.2)] hover:bg-alma-panel/50",
      )}
    >
      {e}
    </button>
  );
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar
          title={t("vault.yourMemories")}
          subtitle={t("vault.heading")}
          leading={{
            icon: iconMenu,
            label: t("nav.menu"),
            onClick: n.open,
          }}
          actions={[
            {
              icon: iconSearchLarge,
              label: t("vault.searchAll"),
              onClick: c.open,
            },
          ]}
        />
        <div className="hidden shrink-0 flex-wrap items-start justify-between gap-4 px-4 sm:px-[30px] pb-6 pt-[38px] md:flex">
          <div className="flex flex-col gap-3">
            <p className="font-body text-sm tracking-[0.14px] text-[rgba(23,50,77,0.6)] opacity-80">
              {t("vault.heading")}
            </p>
            <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink/80">
              {t("vault.yourMemories")}
            </h1>
          </div>
          <div className="flex w-full items-center gap-2.5 rounded-[24px] border border-dashed border-[rgba(23,50,77,0.6)] px-4 py-2.5 sm:w-auto sm:px-6">
            <img src={B2} alt="" className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={m}
              onChange={(e) => setM(e.target.value)}
              placeholder={t("vault.searchImage")}
              aria-label={t("vault.searchAll")}
              className="w-full bg-transparent font-body text-base tracking-[0.16px] text-[rgba(23,50,77,0.9)] outline-none placeholder:text-[rgba(23,50,77,0.7)] sm:w-[180px]"
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 px-4 sm:px-[30px] pb-6">
          {RComponent(
            "All",
            f === null && k === null,
            () => {
              setF(null);
              setK(null);
            },
            "all",
          )}
          {Y.map((e) => RComponent(e, f === e, () => setF(f === e ? null : e), `tag-${e}`))}
          {o2.map((e) => RComponent(e.name, k === e.id, () => setK(k === e.id ? null : e.id), `vault-${e.id}`))}
        </div>
        {!q && (
          <div className="flex flex-col gap-3.5 px-4 pb-8 md:hidden">
            <HComponent icon={iconBrain} title={t("vault.col.memories")} count={x.length} empty={t("vault.noItems")}>
              {x.slice(0, 2).map((e) => (
                <KComponent key={e.id} onClick={() => v(`/memories/${e.id}`)}>
                  <p className="truncate font-body text-[13px] font-medium leading-[18px] tracking-[0.26px] text-alma-ink">
                    {(e.content ?? "").split(`
`)[0] || t("common.untitled")}
                  </p>
                  <p className="line-clamp-2 font-body text-[12px] leading-[17px] tracking-[0.24px] text-alma-muted">
                    {e.content}
                  </p>
                  <div className="flex w-full items-center gap-2">
                    {e.tags?.[0] && (
                      <span className="rounded-full bg-alma-panel px-2 py-[3px] font-body text-[11px] leading-4 tracking-[0.22px] text-alma-ink">
                        {e.tags[0]}
                      </span>
                    )}
                    <span className="min-w-0 flex-1" />
                    <span className="shrink-0 font-body text-[11px] leading-4 tracking-[0.22px] text-alma-faint">
                      {relativeAge(e.timestamp, S)}
                    </span>
                  </div>
                </KComponent>
              ))}
            </HComponent>
            <HComponent
              icon={iconBell}
              title={t("vault.col.reminders")}
              count={_.length}
              empty={t("vault.noReminders")}
            >
              {_.slice(0, 3).map((e) => (
                <KComponent key={e.id} className="flex-row items-center gap-[11px] py-[11px]">
                  <span className="size-[21px] shrink-0 rounded-[6px] border-[1.4px] border-alma-line bg-alma-surface" />
                  <span className="min-w-0 flex-1 truncate font-body text-[13.5px] leading-[21px] tracking-[0.135px] text-alma-ink">
                    {e.event_name}
                  </span>
                </KComponent>
              ))}
            </HComponent>
            <HComponent
              icon={iconImg}
              title={t("vault.col.images")}
              count={y.length}
              onOpen={() => v("/gallery")}
              empty={t("vault.noItems")}
            >
              {y.length > 0 && (
                <div className="flex w-full items-start gap-2">
                  {y.slice(0, 4).map((e) => (
                    <img
                      key={e.id}
                      src={e.url}
                      alt=""
                      className="h-[70px] min-w-0 flex-1 rounded-[14px] object-cover"
                    />
                  ))}
                </div>
              )}
            </HComponent>
          </div>
        )}
        {q ? (
          <div className="flex flex-1 items-center justify-center font-body text-sm text-[rgba(23,50,77,0.5)]">
            {t("vault.loading")}
          </div>
        ) : (
          <div className="hidden min-h-0 flex-1 items-start gap-5 overflow-x-auto px-4 sm:px-[30px] pb-8 md:flex">
            <VComponent
              icon={I2}
              title={t("vault.col.memories")}
              actionLabel="Capture the moment"
              onAction={() =>
                v("/chat", {
                  state: {
                    newConversation: true,
                  },
                })
              }
              className="max-h-full"
            >
              {x.length === 0 ? (
                <MComponent>
                  {m || f || k ? "No memories match your filter." : "No memories yet. Start journaling in the chat."}
                </MComponent>
              ) : (
                x.map((e) => {
                  const { title, body } = splitTitle(e.content);
                  return (
                    <TComponent key={e.id}>
                      <p className="font-body text-xs font-medium tracking-[0.24px] text-alma-ink">{title}</p>
                      {body && (
                        <p className="mt-1 line-clamp-2 font-body text-[10px] tracking-[0.2px] text-[rgba(23,50,77,0.5)]">
                          {body}
                        </p>
                      )}
                      <OComponent tag={firstNonEmpty(e.tags)} age={relativeAge(e.timestamp ?? e.created_at, S)} />
                    </TComponent>
                  );
                })
              )}
            </VComponent>
            <VComponent
              icon={H2}
              title={t("vault.col.reminders")}
              actionLabel="Add to reminders"
              onAction={() => v("/calendar")}
              className="max-h-full"
            >
              {_.length === 0 ? (
                <MComponent>{t("vault.noReminders")}</MComponent>
              ) : (
                _.map((e) => (
                  <TComponent key={e.id}>
                    <p className="font-body text-xs font-medium tracking-[0.24px] text-alma-ink">
                      {e.event_name ?? "(no title)"}
                    </p>
                    {e.event_description && (
                      <p className="mt-1 line-clamp-2 font-body text-[10px] tracking-[0.2px] text-[rgba(23,50,77,0.5)]">
                        {e.event_description}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <img src={E2} alt="" className="h-3 w-3 shrink-0" />
                      <span className="font-body text-[10px] tracking-[0.2px] text-[rgba(23,50,77,0.8)]">
                        {formatMemoryDate(e.event_date, e.reminder_time)}
                      </span>
                    </div>
                    <OComponent tag={null} age={relativeAge(e.reminder_time ?? e.event_date, S)} />
                  </TComponent>
                ))
              )}
            </VComponent>
            <VComponent
              icon={T2}
              title={t("vault.col.todo")}
              actionLabel="Add to lists"
              onAction={() =>
                v("/chat", {
                  state: {
                    newConversation: true,
                  },
                })
              }
              className="max-h-full"
            >
              {F.length === 0 ? (
                <MComponent>
                  No lists yet. On WhatsApp, say “add milk to groceries” and Alma will create one.
                </MComponent>
              ) : (
                F.map((e) => (
                  <TComponent key={e.id}>
                    <button
                      type="button"
                      onClick={() => l2(e.id)}
                      className="flex w-full items-center justify-between gap-2 text-start"
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        {A === e.id ? (
                          <ChevronUp className="h-3 w-3 shrink-0 text-[rgba(23,50,77,0.5)]" />
                        ) : (
                          <ChevronDown className="h-3 w-3 shrink-0 text-[rgba(23,50,77,0.5)]" />
                        )}
                        <span className="truncate font-body text-xs font-medium tracking-[0.24px] text-alma-ink">
                          {e.list_name}
                        </span>
                      </span>
                      <span className="shrink-0 font-body text-[10px] tracking-[0.2px] text-[rgba(23,50,77,0.6)]">
                        {e.openCount} open
                      </span>
                    </button>
                    {A === e.id && N[e.id] && (
                      <ul className="mt-2 space-y-1 ps-[18px]">
                        {N[e.id].length === 0 ? (
                          <li className="font-body text-[10px] text-[rgba(23,50,77,0.5)]">{t("vault.noItems")}</li>
                        ) : (
                          N[e.id].map((o) => (
                            <li key={o.id} className="flex items-center gap-2 font-body text-[10px]">
                              <span
                                className={cn(
                                  "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                                  o.is_completed ? "bg-[rgba(23,50,77,0.3)]" : "bg-alma-accent-deep",
                                )}
                              />
                              <span
                                className={cn(
                                  "truncate",
                                  o.is_completed
                                    ? "text-[rgba(23,50,77,0.4)] line-through"
                                    : "text-[rgba(23,50,77,0.8)]",
                                )}
                              >
                                {o.title}
                              </span>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </TComponent>
                ))
              )}
            </VComponent>
            <VComponent
              icon={Z2}
              title={t("vault.col.images")}
              actionLabel="Capture the moment"
              onAction={() => v("/gallery")}
              className="max-h-full"
            >
              {y.length === 0 ? (
                <MComponent>{m ? "No images match your search." : "No saved images yet."}</MComponent>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {y.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => window.open(e.url, "_blank")}
                      className="overflow-hidden rounded-[6px] border-[0.5px] border-[#d5e2ec] transition-opacity hover:opacity-90"
                    >
                      <img
                        src={e.url}
                        alt={e.memoryContent.slice(0, 40) || "saved image"}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </VComponent>
          </div>
        )}
      </div>
    </div>
  );
}
