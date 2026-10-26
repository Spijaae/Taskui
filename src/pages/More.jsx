import gear from "@/assets/gear.svg";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { useSearchPalette } from "@/components/SearchPalette";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { greetingName } from "@/lib/chatGreeting";
import { activeDays } from "@/lib/journeyStats";
import { cn } from "@/lib/utils";

const iconChart =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/chart'%3e%3cpath%20id='Vector'%20d='M2.375%202.375V16.625H16.625'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.55'/%3e%3cpath%20id='Vector_2'%20d='M5.54167%2011.875L8.70833%207.91667L11.0833%2010.2917L15.0417%204.75'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.55'/%3e%3c/g%3e%3c/svg%3e";
const iconSearch =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/search'%3e%3cpath%20id='Vector'%20d='M14.25%208.70833C14.25%2011.7689%2011.7689%2014.25%208.70833%2014.25C5.64776%2014.25%203.16667%2011.7689%203.16667%208.70833C3.16667%205.64776%205.64776%203.16667%208.70833%203.16667C11.7689%203.16667%2014.25%205.64776%2014.25%208.70833Z'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.55'/%3e%3cpath%20id='Vector_2'%20d='M15.8333%2015.8333L13.0625%2013.0625'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.55'/%3e%3c/g%3e%3c/svg%3e";
const iconMsg =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/msg'%3e%3cpath%20id='Vector'%20d='M16.625%209.10417C16.6273%2010.0189%2016.4409%2010.9243%2016.0774%2011.7637C15.7139%2012.6031%2015.1812%2013.3585%2014.5124%2013.9827C13.8437%2014.6068%2013.0534%2015.0863%2012.1909%2015.3911C11.3285%2015.6959%2010.4124%2015.8195%209.5%2015.7542C8.45552%2015.7534%207.42556%2015.5094%206.49167%2015.0417L2.375%2016.625L3.87917%2012.5875C3.24095%2011.5815%202.88469%2010.4226%202.84764%209.23182C2.81058%208.04106%203.0941%206.86221%203.66854%205.8185C4.24298%204.7748%205.08725%203.90458%206.11309%203.29882C7.13893%202.69306%208.30866%202.374%209.5%202.375C10.4191%202.30908%2011.3419%202.4349%2012.2098%202.74448C13.0777%203.05405%2013.8718%203.54062%2014.5417%204.17333C15.2117%204.80603%2015.7428%205.57106%2016.1014%206.41988C16.46%207.2687%2016.6383%208.18279%2016.625%209.10417Z'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.55'/%3e%3c/g%3e%3c/svg%3e";
const iconHelp =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/help'%3e%3cpath%20id='Vector'%20d='M16.625%209.5C16.625%2013.435%2013.435%2016.625%209.5%2016.625C5.56497%2016.625%202.375%2013.435%202.375%209.5C2.375%205.56497%205.56497%202.375%209.5%202.375C13.435%202.375%2016.625%205.56497%2016.625%209.5Z'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.55'/%3e%3cpath%20id='Vector_2'%20d='M7.20417%207.125C7.4011%206.61171%207.77%206.18264%208.24796%205.91097C8.72592%205.6393%209.28332%205.54186%209.8251%205.63527C10.3669%205.72868%2010.8595%206.00715%2011.2189%206.42319C11.5782%206.83923%2011.7822%207.36707%2011.7958%207.91667C11.7958%209.5%209.42083%2010.2917%209.42083%2010.2917M9.5%2013.4583H9.50792'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.55'/%3e%3c/g%3e%3c/svg%3e";
const iconOut =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/out'%3e%3cpath%20id='Vector'%20d='M7.125%2016.625H3.95833C3.53841%2016.625%203.13568%2016.4582%202.83875%2016.1613C2.54181%2015.8643%202.375%2015.4616%202.375%2015.0417V3.95833C2.375%203.53841%202.54181%203.13568%202.83875%202.83875C3.13568%202.54181%203.53841%202.375%203.95833%202.375H7.125'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23B3261E'%20stroke-opacity='0.8'/%3e%3cpath%20id='Vector_2'%20d='M12.6667%205.54167L16.625%209.5L12.6667%2013.4583M16.625%209.5H7.125'%20stroke-width='1.425'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23B3261E'%20stroke-opacity='0.8'/%3e%3c/g%3e%3c/svg%3e";
const iconChev =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/chev'%3e%3cpath%20id='Vector'%20d='M6%2012L10%208L6%204'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.35'/%3e%3c/g%3e%3c/svg%3e";
function O1Component({ icon, label, hint, onClick, danger, last }) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 p-[14px] text-start transition-colors hover:bg-alma-soft/60"
      >
        <img src={icon} alt="" className="size-[19px] shrink-0" />
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-body text-[15px] leading-6 tracking-[0.15px]",
            danger ? "text-[#b3261e]" : "text-alma-ink",
          )}
        >
          {label}
        </span>
        {hint && (
          <span className="shrink-0 font-body text-[13.5px] leading-[21px] tracking-[0.135px] text-alma-faint">
            {hint}
          </span>
        )}
        {!danger && <img src={iconChev} alt="" className="size-4 shrink-0 rtl:-scale-x-100" />}
      </button>
      {!last && <div className="h-px w-full bg-alma-hairline" />}
    </>
  );
}
function UComponent({ children }) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[18px] border border-alma-hairline bg-alma-surface shadow-[0px_2px_8px_0px_rgba(23,41,61,0.05)]">
      {children}
    </div>
  );
}
export default function More() {
  const s = useNavigate();
  const { t, locale } = useI18n();
  const c = useSearchPalette();
  const [r, setR] = React.useState("");
  const [b, setB] = React.useState("?");
  const [p, setP] = React.useState(null);
  const [k, setK] = React.useState(null);
  React.useEffect(() => {
    let x = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || x) {
        return;
      }
      const f = greetingName(user.user_metadata?.display_name, user.email);
      setR(f);
      setB((f || "?").charAt(0).toUpperCase());
      const [{ data }, { data: data_1 }] = await Promise.all([
        supabase.from("memories").select("timestamp").eq("user_id", user.id),
        supabase.from("profiles").select("preferences").eq("user_id", user.id).maybeSingle(),
      ]);
      if (x) {
        return;
      }
      if (data) {
        setP({
          memories: data.length,
          days: activeDays(data.map((L) => L.timestamp)),
        });
      }
      const h = data_1?.preferences?.whatsapp;
      setK(h?.enabled === true);
    })();
    return () => {
      x = true;
    };
  }, []);
  const onClick = async () => {
    await supabase.auth.signOut();
    s("/");
  };
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[342px] flex-col gap-3 px-0 py-4 sm:max-w-[560px]">
          <h1 className="px-1 pb-1 font-display text-[17px] font-semibold tracking-[0.17px] text-alma-ink">
            {t("nav.more")}
          </h1>
          <button
            type="button"
            onClick={() => s("/profile")}
            className="flex w-full items-center gap-[13px] rounded-[18px] border border-[#9cc3de] bg-alma-soft p-4 text-start transition-opacity hover:opacity-90"
          >
            <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#e9ecf7] font-display text-[17px] font-semibold tracking-[0.17px] text-[#5b6bb5]">
              {b}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="truncate font-display text-[15px] font-semibold leading-[21px] tracking-[0.15px] text-alma-ink">
                {r}
              </span>
              {p && (
                <span className="truncate font-body text-[11px] leading-4 tracking-[0.22px] text-alma-ink">
                  {t("more.summary", {
                    memories: p.memories.toLocaleString(locale),
                    days: p.days.toLocaleString(locale),
                  })}
                </span>
              )}
            </span>
          </button>
          <UComponent>
            <O1Component icon={iconChart} label={t("more.journey")} onClick={() => s("/analytics")} />
            <O1Component icon={iconSearch} label={t("more.search")} onClick={c.open} last />
          </UComponent>
          <UComponent>
            <O1Component
              icon={iconMsg}
              label={t("more.linkWhatsApp")}
              hint={k === null ? null : t(k ? "more.linked" : "more.notLinked")}
              onClick={() => s("/settings")}
            />
            <O1Component icon={gear} label={t("nav.settings")} onClick={() => s("/settings")} last />
          </UComponent>
          <UComponent>
            <O1Component icon={iconHelp} label={t("more.help")} onClick={() => s("/settings")} />
            <O1Component icon={iconOut} label={t("nav.signOut")} onClick={onClick} danger last />
          </UComponent>
        </div>
      </div>
    </div>
  );
}
