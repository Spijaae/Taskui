import { useReducedMotion, motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import React from "react";
import { useLocation, Link } from "react-router-dom";
import motif1 from "@/assets/motif-1.png";
import motif4 from "@/assets/motif-4.png";
import motif5 from "@/assets/motif-5.png";
import ringOuter from "@/assets/ring-outer.png";
import { AppSidebar } from "@/components/AppSidebar";
import { orbitGlow, orbitInner, orbitCore } from "@/components/auth/AuthArt";
import { useSearchPalette } from "@/components/SearchPalette";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { iconMsg } from "@/lib/appIcons";
import { iconSearch } from "@/lib/icons";
import { springPop, springSnappy } from "@/lib/motion";

const r = {
  w: 680,
  h: 340,
};
const t = (s) => `${(s / r.w) * 100}%`;
const o = (s) => `${(s / r.h) * 100}%`;
const O = [
  [motif1, 200, 122, 58],
  [motif4, 138, 198, 56],
  [motif5, 408, 192, 60],
];
function AComponent() {
  const s = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-[680px]"
      style={{
        aspectRatio: `${r.w} / ${r.h}`,
      }}
    >
      <img
        src={orbitGlow}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: t(-20),
          top: o(-60),
          width: t(660),
          height: o(460),
        }}
      />
      <img
        src={ringOuter}
        alt=""
        className="pointer-events-none absolute max-w-none opacity-80"
        style={{
          left: t(50),
          top: o(63),
          width: t(500),
          height: o(224),
        }}
      />
      <img
        src={orbitInner}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: t(145),
          top: o(120),
          width: t(310),
          height: o(110),
        }}
      />
      <motion.img
        src={orbitCore}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: t(276),
          top: o(151),
          width: t(48),
          aspectRatio: "1 / 1",
        }}
        animate={
          s
            ? undefined
            : {
                scale: [1, 1.06, 1],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {O.map(([c, a, n, p], i) => (
        <motion.div
          key={c}
          className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[13px] border-[3px] border-white shadow-[0px_8px_22px_0px_rgba(23,50,77,0.14)]"
          style={{
            left: t(a),
            top: o(n),
            width: t(p),
            aspectRatio: "1 / 1",
          }}
          animate={
            s
              ? undefined
              : {
                  y: [0, -4, 0],
                }
          }
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        >
          <img src={c} alt="" className="h-full w-full object-cover" />
        </motion.div>
      ))}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${r.w} ${r.h}`}
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M452 168 C 510 150, 545 120, 588 84"
          stroke="rgba(40,94,133,0.32)"
          strokeWidth="1.5"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
      </svg>
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[13px] border-2 border-dashed border-[rgba(23,50,77,0.22)] bg-white/60"
        style={{
          left: t(604),
          top: o(62),
          width: t(58),
          aspectRatio: "1 / 1",
        }}
        animate={
          s
            ? undefined
            : {
                x: [0, 6, 0],
                y: [0, -5, 0],
                opacity: [0.75, 1, 0.75],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="flex h-full w-full items-center justify-center">
          <ImageIcon className="h-1/3 w-1/3 text-[rgba(23,50,77,0.3)]" strokeWidth={1.5} />
        </span>
      </motion.div>
    </div>
  );
}
const V =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%20clip-path='url(%23clip0_0_108)'%3e%3cpath%20id='Vector'%20d='M4.66667%206.33333C5.21895%206.33333%205.66667%205.88562%205.66667%205.33333C5.66667%204.78105%205.21895%204.33333%204.66667%204.33333C4.11438%204.33333%203.66667%204.78105%203.66667%205.33333C3.66667%205.88562%204.11438%206.33333%204.66667%206.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M13.9985%207.33333C14%207.64673%2014%207.97953%2014%208.33333C14%2011.3189%2014%2012.8117%2013.0725%2013.7392C12.145%2014.6667%2010.6522%2014.6667%207.66667%2014.6667C4.68111%2014.6667%203.18833%2014.6667%202.26083%2013.7392C1.33333%2012.8117%201.33333%2011.3189%201.33333%208.33333C1.33333%205.34777%201.33333%203.85499%202.26083%202.92749C3.18833%202%204.68111%202%207.66667%202C8.02047%202%208.35327%202%208.66667%202.00154'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M12.3333%201.33333L12.5053%201.79802C12.7307%202.40735%2012.8435%202.71201%2013.0657%202.93426C13.288%203.15651%2013.5927%203.26925%2014.202%203.49472L14.6667%203.66667L14.202%203.83861C13.5927%204.06409%2013.288%204.17683%2013.0657%204.39907C12.8435%204.62132%2012.7307%204.92599%2012.5053%205.53531L12.3333%206L12.1614%205.53531C11.9359%204.92599%2011.8232%204.62132%2011.6009%204.39907C11.3787%204.17683%2011.074%204.06409%2010.4647%203.83861L10%203.66667L10.4647%203.49472C11.074%203.26925%2011.3787%203.15651%2011.6009%202.93426C11.8232%202.71201%2011.9359%202.40735%2012.1614%201.79802L12.3333%201.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M3%2014.3333C5.91497%2010.85%209.18273%206.256%2013.9983%209.3616'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_108'%3e%3crect%20width='16'%20height='16'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const NotFound = () => {
  const s = useLocation();
  const c = useSearchPalette();
  const { t } = useI18n();
  const [n, setN] = React.useState(null);
  const [i, setI] = React.useState(null);
  React.useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", s.pathname);
  }, [s.pathname]);
  React.useEffect(() => {
    let u = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (u || (setN(!!user), !user)) {
        return;
      }
      const { count } = await supabase
        .from("memories")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);
      if (!u) {
        setI(count ?? null);
      }
    })();
    return () => {
      u = true;
    };
  }, []);
  return (
    <div className="app-shell-offset flex min-h-screen w-full bg-alma-canvas">
      {n && <AppSidebar />}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
            y: 12,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={springPop}
          className="flex w-full max-w-[680px] flex-col items-center"
        >
          <AComponent />
          <motion.span
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              ...springSnappy,
              delay: 0.08,
            }}
            className="mt-2 flex items-center gap-2 rounded-full border border-[rgba(40,94,133,0.2)] bg-alma-panel px-3.5 py-1.5"
          >
            <span className="font-body text-[12.5px] font-semibold tracking-[0.25px] text-[#17324d]">404</span>
            <span className="h-[3px] w-[3px] rounded-full bg-[rgba(23,50,77,0.4)]" />
            <span className="font-body text-[12.5px] tracking-[0.25px] text-[rgba(23,50,77,0.8)]">
              {t("notFound.badge")}
            </span>
          </motion.span>
          <h1 className="mt-5 text-center font-display text-[34px] font-semibold leading-tight tracking-[0.34px] text-alma-ink sm:text-[40px]">
            {t("notFound.title")}
          </h1>
          <p className="mt-4 max-w-[520px] text-center font-body text-[15px] leading-[26px] tracking-[0.15px] text-[rgba(23,50,77,0.62)]">
            {t("notFound.body")}
          </p>
          <div className="mt-7 flex w-full max-w-[342px] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <Link
              to={n ? "/chat" : "/auth"}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-3 ps-5 pe-6 font-body text-[14px] font-medium tracking-[0.28px] text-white shadow-[0px_4px_12px_0px_rgba(40,94,133,0.16)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
            >
              <img src={iconMsg} alt="" className="brightness-0 invert h-4 w-4" />
              {t(n ? "notFound.backToChat" : "auth.signIn")}
            </Link>
            <Link
              to={n ? "/gallery" : "/"}
              className="flex items-center justify-center gap-2 rounded-full border border-[rgba(23,50,77,0.16)] bg-white py-3 ps-5 pe-6 font-body text-[14px] font-medium tracking-[0.28px] text-[rgba(23,50,77,0.82)] transition-colors hover:bg-alma-panel/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
            >
              <img src={V} alt="" className="h-4 w-4" />
              {t(n ? "notFound.openGallery" : "notFound.backHome")}
            </Link>
          </div>
          {n && (
            <button
              type="button"
              onClick={c.open}
              className="mt-7 flex flex-wrap items-center justify-center gap-2 rounded-full px-3 py-1.5 font-body text-[13px] text-[rgba(23,50,77,0.5)] transition-colors hover:text-[rgba(23,50,77,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
            >
              <img src={iconSearch} alt="" className="h-3.5 w-3.5" />
              {t("notFound.lookingFor")}
              <kbd className="rounded-[6px] border border-[rgba(23,50,77,0.14)] bg-[#eaf3fa] px-1.5 py-0.5 font-body text-[11px] font-medium text-[rgba(23,50,77,0.65)]">
                ⌘K
              </kbd>
              {i === null
                ? "to search your memories"
                : `to search ${i.toLocaleString()} ${i === 1 ? "memory" : "memories"}`}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default NotFound;
