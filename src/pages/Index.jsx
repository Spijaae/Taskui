import logoMark from "@/assets/logo-mark.svg";
import heroClouds from "@/assets/hero-clouds.webp";
import heroBrowserChat from "@/assets/hero-browser-chat.webp";
import heroPhoneChat from "@/assets/hero-phone-chat.webp";
import breakfast from "@/assets/breakfast.webp";
import bike from "@/assets/bike.webp";
import fox from "@/assets/fox.webp";
import hill from "@/assets/hill.webp";
import orbitStage from "@/assets/orbit-stage.webp";
import orbitPhone from "@/assets/orbit-phone.webp";
import {
  useReducedMotion,
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import {
  Mic as MicIcon,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Globe as GlobeIcon,
  Smartphone,
  Languages,
  FileText,
  ArrowUp,
  Bell as BellIcon,
  Check as CheckIcon,
  Sparkles,
  Plus as PlusIcon,
  Timer as TimerIcon,
  Images,
  ListTodo,
  Search as SearchIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Star as StarIcon,
  Minus as MinusIcon,
  ArrowRight,
} from "lucide-react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import PhoneNudgeDialog from "@/components/PhoneNudgeDialog";
import SmoothScroll from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

const Qu = [
  {
    id: "how-it-works",
    label: "How it works",
    blurb: "Keep a memory in ten seconds",
    inPill: true,
  },
  {
    id: "the-app",
    label: "The app",
    blurb: "Your vault on web and phone",
    inPill: true,
  },
  {
    id: "who-its-for",
    label: "Who it's for",
    blurb: "Family, care, new parents, you",
    inPill: false,
  },
  {
    id: "the-vault",
    label: "The vault",
    blurb: "Your life, closest first",
    inPill: true,
  },
  {
    id: "privacy",
    label: "Privacy",
    blurb: "Your memories, your rules",
    inPill: true,
  },
  {
    id: "the-price",
    label: "The price",
    blurb: "Free while in early access",
    inPill: false,
  },
  {
    id: "questions",
    label: "Questions",
    blurb: "Short answers before you start",
    inPill: false,
  },
];
const m9 = Qu.filter((e) => e.inPill);
function g9(e) {
  const t = e.filter((r) => r.isIntersecting && r.top <= 0);
  if (t.length > 0) {
    return t.reduce((acc, item) => {
      if (item.top > acc.top) {
        return item;
      }
      return acc;
    }).id;
  }
  const n = e.filter((r) => r.isIntersecting);
  if (n.length === 0) {
    return null;
  }
  return n.reduce((acc, item) => {
    if (item.top < acc.top) {
      return item;
    }
    return acc;
  }).id;
}
const ease = [0.16, 1, 0.3, 1];
const rw = {
  up: {
    x: 0,
    y: 24,
  },
  down: {
    x: 0,
    y: -24,
  },
  left: {
    x: 24,
    y: 0,
  },
  right: {
    x: -24,
    y: 0,
  },
  none: {
    x: 0,
    y: 0,
  },
};
function Ue1Component({ as, children, direction = "up", delay = 0, duration = 0.6, className, ...rest }) {
  const a = useReducedMotion();
  const L = motion[as ?? "div"];
  const { x, y } = a ? rw.none : rw[direction];
  return (
    <L
      className={className}
      initial={{
        opacity: 0,
        x,
        y,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "0px 0px -12% 0px",
      }}
      transition={{
        duration: a ? 0.25 : duration,
        delay,
        ease,
      }}
      {...rest}
    >
      {children}
    </L>
  );
}
const iconClose =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/close'%3e%3cpath%20id='Vector'%20d='M3.5%203.5L8%208M8%208L12.5%2012.5M8%208L12.5%203.5M8%208L3.5%2012.5'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke='%2317324D'/%3e%3c/g%3e%3c/svg%3e";
const iconChevron =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/chevron'%3e%3cpath%20id='Vector'%20d='M6%203.5L10.5%208L6%2012.5'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.6'/%3e%3c/g%3e%3c/svg%3e";
const iconWhatsapp =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/whatsapp'%3e%3cpath%20id='Vector'%20d='M10%202.08333C8.60612%202.08307%207.23688%202.45082%206.0307%203.14942C4.82453%203.84803%203.82418%204.85271%203.1308%206.06189C2.43742%207.27108%202.07559%208.6419%202.08189%2010.0358C2.08819%2011.4296%202.46239%2012.7971%203.16667%2014L2.08333%2017.9167L6.08333%2016.8333C7.13608%2017.449%208.31684%2017.8132%209.5335%2017.8974C10.7502%2017.9816%2011.9698%2017.7835%2013.0973%2017.3187C14.2249%2016.8539%2015.2297%2016.1349%2016.0336%2015.2177C16.8375%2014.3005%2017.4185%2013.2101%2017.7315%2012.0314C18.0445%2010.8526%2018.081%209.61753%2017.838%208.4224C17.595%207.22728%2017.0792%206.10445%2016.3308%205.1415C15.5824%204.17856%2014.6217%203.40154%2013.5235%202.87107C12.4254%202.34059%2011.2195%202.071%2010%202.08333Z'%20fill='%2323B33A'/%3e%3cpath%20id='Vector_2'%20d='M7.16667%206.16667C7.33333%205.83333%207.5%205.83333%207.66667%205.83333H8.08333C8.25%205.83333%208.41667%205.83333%208.58333%206.16667L9.25%207.75C9.33333%207.91667%209.25%208.08333%209.16667%208.25L8.75%208.75C8.66667%208.83333%208.58333%209%208.75%209.16667C9.08333%209.83333%209.58333%2010.4167%2010.1667%2010.8333C10.4167%2011%2010.6667%2011.1667%2010.9167%2011.25C11.0833%2011.3333%2011.25%2011.25%2011.3333%2011.1667L11.8333%2010.5833C12%2010.4167%2012.0833%2010.4167%2012.3333%2010.5L13.8333%2011.25C14%2011.3333%2014.1667%2011.4167%2014.1667%2011.5833C14.1667%2012%2014.0833%2012.5%2013.75%2012.8333C13.3333%2013.25%2012.6667%2013.5%2012.0833%2013.4167C10.75%2013.1667%209.58333%2012.5%208.58333%2011.5C7.66667%2010.6667%207%209.5%206.75%208.33333C6.66667%207.66667%206.83333%207%207.16667%206.16667Z'%20fill='white'/%3e%3c/g%3e%3c/svg%3e";
const x9 =
  "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10%202.5V5M10%2015V17.5M2.5%2010H5M15%2010H17.5'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M13.3337%2010.0001C13.3337%2011.841%2011.8413%2013.3334%2010.0003%2013.3334C8.15938%2013.3334%206.66699%2011.841%206.66699%2010.0001C6.66699%208.15913%208.15938%206.66675%2010.0003%206.66675C11.8413%206.66675%2013.3337%208.15913%2013.3337%2010.0001Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const w9 =
  "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M5.00033%203.75H15.0003C16.1509%203.75%2017.0837%204.68274%2017.0837%205.83333V12.5C17.0837%2013.6506%2016.1509%2014.5833%2015.0003%2014.5833H5.00033C3.84973%2014.5833%202.91699%2013.6506%202.91699%2012.5V5.83333C2.91699%204.68274%203.84973%203.75%205.00033%203.75Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M6.66699%2017.0833H13.3337'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const b9 =
  "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10%207.5C10%208.88071%208.88071%2010%207.5%2010C6.11929%2010%205%208.88071%205%207.5C5%206.11929%206.11929%205%207.5%205C8.88071%205%2010%206.11929%2010%207.5Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M2.91699%2015.8333C2.91699%2014.6178%203.39988%2013.452%204.25942%2012.5924C5.11896%2011.7329%206.28475%2011.25%207.50033%2011.25C8.7159%2011.25%209.88169%2011.7329%2010.7412%2012.5924C11.6008%2013.452%2012.0837%2014.6178%2012.0837%2015.8333'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M16.0833%208.33341C16.0833%209.39196%2015.2252%2010.2501%2014.1667%2010.2501C13.1081%2010.2501%2012.25%209.39196%2012.25%208.33341C12.25%207.27487%2013.1081%206.41675%2014.1667%206.41675C15.2252%206.41675%2016.0833%207.27487%2016.0833%208.33341Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M12.917%2012.1666C13.4363%2012.1085%2013.9621%2012.1595%2014.4606%2012.3165C14.959%2012.4735%2015.4192%2012.7329%2015.8115%2013.0781C16.2038%2013.4234%2016.5196%2013.8468%2016.7387%2014.3213C16.9578%2014.7957%2017.0753%2015.3107%2017.0837%2015.8333'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const k9 =
  "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M17.5%2010C17.5%2012.0711%2014.1421%2013.75%2010%2013.75C5.85786%2013.75%202.5%2012.0711%202.5%2010C2.5%207.92893%205.85786%206.25%2010%206.25C14.1421%206.25%2017.5%207.92893%2017.5%2010Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M14.1663%2010C14.1663%2011.1046%2012.3009%2012%209.99967%2012C7.69849%2012%205.83301%2011.1046%205.83301%2010C5.83301%208.89543%207.69849%208%209.99967%208C12.3009%208%2014.1663%208.89543%2014.1663%2010Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const privacy =
  "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10.0003%202.91675L4.16699%205.00008V9.58341C4.16699%2013.1667%206.66699%2016.0834%2010.0003%2017.0834C13.3337%2016.0834%2015.8337%2013.1667%2015.8337%209.58341V5.00008L10.0003%202.91675Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const E9 =
  "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20transform='translate(2.6667%202.6667)'%3e%3cpath%20d='M0.666667%207.75V1.5C0.666667%201.27899%200.754464%201.06702%200.910745%200.910745C1.06702%200.754464%201.27899%200.666667%201.5%200.666667H7.75L14%206.91667L7.75%2013.1667L0.666667%207.75Z'%20stroke='%23285E85'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M4.41667%205.5C5.01498%205.5%205.5%205.01498%205.5%204.41667C5.5%203.81836%205.01498%203.33333%204.41667%203.33333C3.81836%203.33333%203.33333%203.81836%203.33333%204.41667C3.33333%205.01498%203.81836%205.5%204.41667%205.5Z'%20stroke='%23285E85'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const questions =
  "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M17.5%2010C17.5%2014.1421%2014.1421%2017.5%2010%2017.5C5.85786%2017.5%202.5%2014.1421%202.5%2010C2.5%205.85786%205.85786%202.5%2010%202.5C14.1421%202.5%2017.5%205.85786%2017.5%2010Z'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M8%207.75012C8.1856%207.31298%208.51497%206.95237%208.93356%206.72804C9.35215%206.50371%209.83481%206.42912%2010.3016%206.51664C10.7684%206.60416%2011.1912%206.84853%2011.5001%207.20927C11.809%207.57%2011.9854%208.02544%2012%208.50012C12%209.91679%2010%2010.1668%2010%2011.5001M10%2014.1668H10.0083'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const C9 = {
  "how-it-works": x9,
  "the-app": w9,
  "who-its-for": b9,
  "the-vault": k9,
  privacy,
  "the-price": E9,
  questions,
};
function useT9() {
  const [e, setE] = React.useState(null);
  React.useEffect(() => {
    const n = Qu.map((s) => document.getElementById(s.id)).filter((s) => s !== null);
    if (n.length === 0) {
      return;
    }
    const r = new IntersectionObserver(
      () => {
        setE(
          g9(
            n.map((s) => {
              const i = s.getBoundingClientRect();
              return {
                id: s.id,
                top: i.top - 96,
                isIntersecting: i.bottom > 96 && i.top < window.innerHeight,
              };
            }),
          ),
        );
      },
      {
        rootMargin: "-96px 0px 0px 0px",
        threshold: [0, 0.01, 0.25, 0.5, 1],
      },
    );
    n.forEach((s) => r.observe(s));
    return () => r.disconnect();
  }, []);
  return e;
}
function Wh1Component({ size = 17, logoW = 22, logoH = 26.102, tracking = 1.02 }) {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <img
        src={logoMark}
        alt=""
        aria-hidden
        width={logoW}
        height={logoH}
        style={{
          width: logoW,
          height: logoH,
        }}
        className="block shrink-0"
      />
      <span
        className="whitespace-nowrap font-brand font-bold leading-[21px] text-alma-ink"
        style={{
          fontSize: size,
          letterSpacing: `${tracking}px`,
          fontVariationSettings: '"SOFT" 0, "WONK" 1',
        }}
      >
        ALMA
      </span>
    </span>
  );
}
function SpComponent({ children, className, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-[45px] items-center justify-center gap-[10px] rounded-xl bg-alma-action px-3",
        "font-body text-base leading-[21px] tracking-[0.02em] text-white",
        "transition-colors duration-200 hover:bg-alma-action-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-action focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow:
            "inset -2px 0 5.2px 0 rgba(200,225,242,0.2), inset 2px 0 5.2px 0 rgba(200,225,242,0.2), inset 0 -2px 5.2px 0 rgba(200,225,242,0.2), inset 0 2px 5.2px 0 rgba(200,225,242,0.2)",
        }}
      />
    </button>
  );
}
function _9() {
  const e = useNavigate();
  const [t, setT] = React.useState(false);
  const r = useT9();
  const s = useReducedMotion();
  const iRef = React.useRef(null);
  React.useEffect(() => {
    if (!t) {
      return;
    }
    const o = (c) => {
      if (c.key === "Escape") {
        setT(false);
      }
    };
    document.addEventListener("keydown", o);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    iRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", o);
      document.body.style.overflow = overflow;
    };
  }, [t]);
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center pt-[14px] lg:flex">
        <nav
          aria-label="Main"
          className="pointer-events-auto flex items-center gap-[28px] rounded-[19px] border border-white/90 py-[6px] ps-5 pe-[6px] backdrop-blur-[10px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.72)",
            boxShadow: "0 8px 24px 0 rgba(23,50,77,0.08)",
          }}
        >
          <a href="#top" aria-label="ALMA — back to top">
            <Wh1Component />
          </a>
          <ul className="flex items-start gap-1">
            {m9.map((o) => (
              <li key={o.id}>
                <a
                  href={`#${o.id}`}
                  className={cn(
                    "block whitespace-nowrap rounded-xl px-[14px] py-[9px] font-body text-[15px] leading-5 text-alma-ink",
                    "transition-colors duration-200 hover:bg-alma-soft",
                    r === o.id && "bg-alma-soft",
                  )}
                  aria-current={r === o.id ? "true" : undefined}
                >
                  {o.label}
                </a>
              </li>
            ))}
          </ul>
          <SpComponent onClick={() => e("/auth")}>Get started</SpComponent>
        </nav>
      </header>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 lg:hidden">
        <nav
          aria-label="Main"
          className="pointer-events-auto flex h-[54px] w-full max-w-[358px] items-center justify-between rounded-[19px] md:h-[60px] md:max-w-[562px] border border-white/90 ps-[17px] pe-[7px] backdrop-blur-[10px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.72)",
            boxShadow: "0 8px 24px 0 rgba(23,50,77,0.08)",
          }}
        >
          <a href="#top" aria-label="ALMA — back to top">
            <Wh1Component size={16} logoW={20} logoH={23.729} tracking={0.96} />
          </a>
          <button
            type="button"
            onClick={() => setT(true)}
            aria-label="Open menu"
            aria-expanded={t}
            className="flex size-[42px] shrink-0 flex-col items-center justify-center gap-[5px] rounded-xl transition-colors hover:bg-alma-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-action"
          >
            <span className="block h-[1.5px] w-4 rounded-full bg-alma-ink" />
            <span className="block h-[1.5px] w-4 rounded-full bg-alma-ink" />
          </button>
        </nav>
      </header>
      <AnimatePresence>
        {t && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setT(false)}
              className="absolute inset-0 w-full cursor-default bg-alma-ink/35 backdrop-blur-[2px]"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            />
            <motion.div
              className="absolute end-0 top-[10px] mx-2 flex max-h-[calc(100dvh-20px)] w-full max-w-[348px] flex-col overflow-hidden rounded-[28px] bg-white"
              style={{
                boxShadow: "-10px 30px 70px -20px rgba(23,50,77,0.35)",
              }}
              initial={
                s
                  ? {
                      opacity: 0,
                    }
                  : {
                      opacity: 0,
                      x: 24,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={
                s
                  ? {
                      opacity: 0,
                    }
                  : {
                      opacity: 0,
                      x: 24,
                    }
              }
              transition={{
                duration: 0.3,
                ease,
              }}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-alma-hairline py-[14px] ps-[22px] pe-[14px]">
                <Wh1Component size={16} logoW={20} logoH={23.729} tracking={0.96} />
                <button
                  ref={iRef}
                  type="button"
                  onClick={() => setT(false)}
                  aria-label="Close menu"
                  className="flex size-[42px] items-center justify-center rounded-xl bg-alma-sunken transition-colors hover:bg-alma-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-action"
                >
                  <img src={iconClose} alt="" aria-hidden width={16} height={16} />
                </button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-[22px] overflow-y-auto px-[14px] py-[18px]">
                <p className="ps-[10px] font-body text-[11px] font-medium tracking-[1.54px] text-alma-faint">MENU</p>
                <ul className="flex flex-col gap-1">
                  {Qu.map((o) => {
                    const a = r === o.id;
                    return (
                      <li key={o.id}>
                        <a
                          href={`#${o.id}`}
                          onClick={() => setT(false)}
                          aria-current={a ? "true" : undefined}
                          className={cn(
                            "flex h-[60px] items-center gap-[14px] rounded-2xl border py-[10px] ps-3 pe-[14px] transition-colors",
                            a ? "border-alma-line-accent bg-alma-soft" : "border-transparent hover:bg-alma-subtle",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-xl",
                              a ? "bg-white" : "bg-alma-sunken",
                            )}
                          >
                            <img src={C9[o.id]} alt="" aria-hidden width={20} height={20} className="block" />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                            <span
                              className={cn(
                                "font-body text-[17px] leading-[22px] tracking-[-0.01em] text-alma-ink",
                                a ? "font-medium" : "font-normal",
                              )}
                            >
                              {o.label}
                            </span>
                            <span className="font-body text-[12.5px] leading-4 text-alma-muted">{o.blurb}</span>
                          </span>
                          <img
                            src={iconChevron}
                            alt=""
                            aria-hidden
                            width={16}
                            height={16}
                            className="shrink-0 rtl:-scale-x-100"
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <div
                  className="flex shrink-0 items-center gap-3 rounded-[18px] p-[14px]"
                  style={{
                    backgroundImage: "linear-gradient(172.43deg, #eef5fb 13.139%, #dceaf6 86.131%)",
                  }}
                >
                  <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#e5f7e8]">
                    <img src={iconWhatsapp} alt="" aria-hidden width={20} height={20} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="font-body text-sm font-medium text-alma-ink">Lives in your WhatsApp</span>
                    <span className="font-body text-[12.5px] leading-4 text-alma-muted">
                      English and <span dir="rtl">العربية</span> · nothing new to learn
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-3 border-t border-alma-hairline bg-alma-subtle px-[18px] pb-5 pt-4">
                <SpComponent className="w-full" onClick={() => e("/auth")}>
                  Start free
                </SpComponent>
                <button
                  type="button"
                  onClick={() => e("/today")}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-alma-line bg-alma-sunken py-[13px] pe-5 ps-[18px] font-body text-sm font-medium leading-5 tracking-[0.28px] text-alma-ink transition-colors hover:bg-alma-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-action"
                >
                  Open the app ↗
                </button>
                <p className="font-body text-xs text-alma-faint">Free during early access · Export any time</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
const iconCheck =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/check'%20clip-path='url(%23clip0_0_18)'%3e%3cpath%20id='Vector'%20d='M9%2018C13.9706%2018%2018%2013.9706%2018%209C18%204.02944%2013.9706%200%209%200C4.02944%200%200%204.02944%200%209C0%2013.9706%204.02944%2018%209%2018Z'%20fill='white'%20fill-opacity='0.75'/%3e%3cpath%20id='Vector_2'%20d='M5.5%209.3L7.8%2011.6L12.5%206.7'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_18'%3e%3crect%20width='18'%20height='18'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const background = "linear-gradient(180deg, #5F9CCB 0%, #8FC0DE 30%, #CFE4F1 55%, #EEF5FA 78%, #F6F9FC 100%)";
const R9 = ["Set up in 30 seconds", "No new app to learn", "Export or delete any time"];
const iw = {
  browser: {
    left: "5.755%",
    top: "0%",
    width: "74.22%",
  },
  phone: {
    left: "71.463%",
    top: "8%",
    width: "23.861%",
  },
};
const To = {
  glow: {
    left: "11.806%",
    top: "0%",
    width: "76.389%",
    height: "70.27%",
  },
  browser: {
    left: "9.444%",
    top: "10.811%",
    width: "67.639%",
  },
  phone: {
    left: "72.222%",
    top: "20.811%",
    width: "18.333%",
  },
  note: {
    left: "6.667%",
    top: "63.784%",
    width: "21.528%",
  },
  fade: {
    top: "64.865%",
    height: "35.135%",
  },
};
function O9Component() {
  const e = useNavigate();
  const t = useReducedMotion();
  const nRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: nRef,
    offset: ["start end", "end start"],
  });
  const s = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const i = useTransform(s, [0, 1], [-34, 34]);
  const o = (delay) => ({
    initial: t
      ? {
          opacity: 0,
        }
      : {
          opacity: 0,
          y: 18,
        },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: t ? 0.3 : 0.7,
      delay,
      ease,
    },
  });
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden"
      style={{
        background,
      }}
    >
      <img
        src={heroClouds}
        alt=""
        aria-hidden
        width={1440}
        height={900}
        loading="eager"
        decoding="async"
        fetchpriority="high"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[66.176%] w-full object-cover"
      />
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex flex-col items-center gap-[18px] px-6 pt-[108px] text-center md:px-12 md:pt-[120px] lg:gap-[22px] lg:px-0 lg:pt-[136px]">
          <motion.div
            {...o(0)}
            className="flex items-center gap-2 rounded-full border py-[6px] pe-3 ps-[10px] lg:gap-[10px] lg:py-[7px] lg:pe-[14px] lg:ps-3"
            style={{
              backgroundColor: "rgba(255,255,255,0.56)",
              borderColor: "rgba(255,255,255,0.8)",
            }}
          >
            <span className="block size-[6px] shrink-0 rounded-full bg-alma-core lg:size-[7px]" />
            <span className="whitespace-nowrap font-body text-[11px] leading-4 text-alma-ink lg:text-[13px] lg:leading-[17px]">
              Early access · English and <span dir="rtl">العربية</span>
            </span>
          </motion.div>
          <motion.h1
            {...o(0.08)}
            className="max-w-[342px] font-body text-[48px] font-normal leading-[48px] tracking-[-0.05em] text-alma-ink md:max-w-[700px] md:text-[64px] md:leading-[62px] lg:max-w-[695px] lg:text-[104px] lg:leading-[100px]"
          >
            Say it once. Find
            <br className="hidden lg:inline" /> it
            <br className="hidden md:inline lg:hidden" />{" "}
            <span className="font-editorial italic text-alma-action md:text-[66px] lg:text-[108px]">years later.</span>
          </motion.h1>
          <motion.p
            {...o(0.16)}
            className="max-w-[342px] font-body text-[17px] leading-[26px] text-[#24425F] md:max-w-[470px] lg:max-w-[560px] lg:text-xl lg:leading-[30px]"
          >
            Send Alma a voice note, a photo or a few words on WhatsApp. It keeps them safe, sorts them for you, and
            hands them back the moment you ask.
          </motion.p>
          <motion.div
            {...o(0.24)}
            className="flex w-full max-w-[342px] flex-col items-stretch gap-[10px] md:w-auto md:max-w-none md:flex-row md:items-start md:gap-3"
          >
            <SpComponent className="w-full lg:w-auto" onClick={() => e("/auth")}>
              Start free
            </SpComponent>
            <a
              href="#how-it-works"
              className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-alma-line bg-[#EEF4F9] py-[13px] pe-5 ps-[18px] font-body text-sm font-medium leading-5 tracking-[0.02em] text-alma-ink transition-colors hover:bg-white"
            >
              See how it works
            </a>
          </motion.div>
          <motion.ul
            {...o(0.32)}
            className="flex flex-wrap items-center justify-center gap-x-[14px] gap-y-2 md:flex-nowrap lg:gap-x-[22px]"
          >
            {R9.map((a) => (
              <li key={a} className="flex items-center gap-[6px] lg:gap-2">
                <img
                  src={iconCheck}
                  alt=""
                  aria-hidden
                  width={18}
                  height={18}
                  className="size-4 shrink-0 lg:size-[18px]"
                />
                <span className="whitespace-nowrap font-body text-[13px] leading-5 text-[#34516C] lg:text-[15px]">
                  {a}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>
        <div className="relative mt-10 px-6 md:hidden">
          <img
            src={heroPhoneChat}
            alt="The ALMA app on a phone, showing a saved conversation"
            width={310}
            height={688}
            loading="eager"
            decoding="async"
            className="mx-auto block h-auto w-[310px] max-w-full"
            style={{
              borderRadius: "15.909% / 7.167%",
              boxShadow: "0 50px 90px -30px rgba(23,50,77,0.45), 0 0 0 1px rgba(23,50,77,0.08)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(246,249,252,0) 0%, rgba(246,249,252,0.55) 50%, rgba(246,249,252,0.95) 85%, #F6F9FC 100%)",
            }}
          />
        </div>
        <div className="relative mt-6 hidden aspect-[834/500] w-full md:block lg:hidden">
          <img
            src={heroBrowserChat}
            alt="The ALMA web app showing a saved conversation"
            width={974}
            height={660}
            loading="eager"
            fetchpriority="high"
            decoding="async"
            className="absolute rounded-[10px]"
            style={{
              ...iw.browser,
              boxShadow: "0 36px 72px -30px rgba(23,50,77,0.34)",
            }}
          />
          <img
            src={heroPhoneChat}
            alt="The same conversation on a phone"
            width={264}
            height={586}
            loading="eager"
            decoding="async"
            className="absolute"
            style={{
              ...iw.phone,
              borderRadius: "15.909% / 7.167%",
              boxShadow: "0 30px 56px -22px rgba(23,50,77,0.38)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(246,249,252,0) 0%, rgba(246,249,252,0.55) 50%, rgba(246,249,252,0.95) 85%, #f6f9fc 100%)",
            }}
          />
        </div>
        <div ref={nRef} className="relative mt-[-3px] hidden aspect-[1440/740] w-full lg:block">
          <div
            aria-hidden
            className="absolute"
            style={{
              ...To.glow,
              background: "radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0))",
            }}
          />
          <div
            className="absolute overflow-hidden"
            style={{
              ...To.browser,
              borderRadius: "18px 18px 0 0",
              boxShadow: "0 60px 120px -50px rgba(23,50,77,0.35), 0 0 0 1px rgba(23,50,77,0.08)",
            }}
          >
            <img
              src={heroBrowserChat}
              alt="The ALMA web app, showing a conversation being saved to the vault"
              width={974}
              height={660}
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="block h-auto w-full"
            />
          </div>
          <img
            src={heroPhoneChat}
            alt="The same conversation on a phone"
            width={264}
            height={586}
            loading="eager"
            decoding="async"
            className="absolute block h-auto"
            style={{
              ...To.phone,
              borderRadius: "15.909% / 7.167%",
              boxShadow: "0 50px 90px -30px rgba(23,50,77,0.45), 0 0 0 1px rgba(23,50,77,0.08)",
            }}
          />
          <motion.div
            className="absolute flex items-center gap-3 py-3 pe-[18px] ps-3 will-change-transform"
            style={{
              ...To.note,
              y: t ? 0 : i,
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: 18,
              boxShadow: "0 24px 48px -20px rgba(23,50,77,0.3)",
            }}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[#e5f7e8]">
              <img src={iconWhatsapp} alt="" aria-hidden width={20} height={20} />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-body text-[13px] font-semibold leading-[17px] text-alma-ink">WhatsApp · Alma</span>
              <span className="font-body text-[13px] leading-[17px] text-alma-muted">
                Kept. Filed under September, with Riya.
              </span>
            </span>
          </motion.div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0"
            style={{
              ...To.fade,
              backgroundImage:
                "linear-gradient(180deg, rgba(246,249,252,0) 0%, rgba(246,249,252,0.55) 50%, rgba(246,249,252,0.95) 85%, #F6F9FC 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
const ow = [
  {
    label: "WhatsApp",
    src: iconWhatsapp,
  },
  {
    label: "Voice notes",
    Icon: MicIcon,
  },
  {
    label: "Photos",
    Icon: ImageIcon,
  },
  {
    label: "Google Calendar",
    Icon: CalendarIcon,
  },
  {
    label: "Any browser",
    Icon: GlobeIcon,
  },
  {
    label: "iPhone and Android",
    Icon: Smartphone,
  },
  {
    label: "English",
    Icon: Languages,
  },
  {
    label: "العربية",
    Icon: Languages,
    rtl: true,
  },
  {
    label: "Notes and lists",
    Icon: FileText,
  },
];
function Aw1Component({ chip, duplicate }) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-[10px] rounded-full border border-alma-hairline bg-white py-[10px] pe-[18px] ps-[14px]"
    >
      {chip.src ? (
        <img src={chip.src} alt="" aria-hidden width={18} height={18} className="shrink-0" />
      ) : chip.Icon ? (
        <chip.Icon size={18} strokeWidth={1.6} className="shrink-0 text-alma-action" aria-hidden />
      ) : null}
      <span className="whitespace-nowrap font-body text-[15px] text-alma-ink" dir={chip.rtl ? "rtl" : undefined}>
        {chip.label}
      </span>
    </li>
  );
}
function M9Component() {
  return (
    <section className="border-b border-alma-hairline bg-alma-canvas pb-[30px] pt-[26px]">
      <div className="flex flex-col items-center gap-4">
        <h2 className="whitespace-nowrap px-4 text-center font-mono text-[11px] tracking-[1.54px] text-alma-faint">
          WORKS WHERE YOU ALREADY ARE
        </h2>
        <div className="relative h-11 w-full overflow-hidden">
          <ul
            className="absolute top-0 flex w-max items-start gap-3 motion-safe:animate-[landing-marquee_42s_linear_infinite] motion-reduce:animate-none"
            style={{
              animationPlayState: undefined,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
          >
            {ow.map((e) => (
              <Aw1Component key={e.label} chip={e} />
            ))}
            {ow.map((e) => (
              <Aw1Component key={`${e.label}-dup`} chip={e} duplicate />
            ))}
          </ul>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-0 w-[140px]"
            style={{
              backgroundImage: "linear-gradient(90deg, #f6f9fc, rgba(246,249,252,0))",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 end-0 w-[140px]"
            style={{
              backgroundImage: "linear-gradient(270deg, #f6f9fc, rgba(246,249,252,0))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
const I9 = 0.18;
function D9Component({ segments, className, triggerRef }) {
  const rRef = React.useRef(null);
  const s = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: triggerRef ?? rRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const { parts, total } = React.useMemo(() => {
    let total_1 = 0;
    return {
      parts: segments.map((d, h) => {
        if (d.fill === false) {
          return {
            kind: "static",
            key: `s${h}`,
            text: d.text,
            className: d.className,
          };
        }
        return {
          kind: "fill",
          key: `f${h}`,
          className: d.className,
          words: d.text
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => ({
              word,
              index: total_1++,
            })),
        };
      }),
      total: total_1,
    };
  }, [segments]);
  return (
    <p ref={rRef} className={className}>
      {parts.map((l) => {
        if (l.kind === "static") {
          return (
            <React.Fragment key={l.key}>
              <span className={l.className}>{l.text}</span>{" "}
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={l.key}>
            {l.words.map(({ word, index }) => (
              <React.Fragment key={index}>
                <L9Component
                  index={index}
                  total={total}
                  progress={scrollYProgress}
                  reduced={!!s}
                  className={l.className}
                >
                  {word}
                </L9Component>{" "}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </p>
  );
}
function L9Component({ index, total, progress, reduced, className, children }) {
  const o = 1 / total;
  const a = index * o * 0.85;
  const l = Math.min(a + o * 3, 1);
  const c = useTransform(progress, [a, l], [I9, 1]);
  return (
    <motion.span
      className={cn("inline-block", className)}
      style={{
        opacity: reduced ? 1 : c,
      }}
    >
      {children}
    </motion.span>
  );
}
const backgroundImage = "linear-gradient(155.31deg, #c8e1f2 13.139%, #e2dcf2 53.285%, #f6e7da 86.131%)";
function Lw1Component({
  src,
  alt = "",
  fig,
  title,
  meta,
  rotate = 0,
  width = 270,
  photoHeight = 144,
  sizeClass,
  className,
  eager,
}) {
  return (
    <figure
      className={cn(
        "group/print relative shrink-0 rounded-md bg-[#fbfaf7] px-[10px] pb-[14px] pt-[10px]",
        sizeClass,
        className,
      )}
      style={{
        width: sizeClass ? undefined : width,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        boxShadow: "0 24px 48px -26px rgba(23,50,77,0.45), 0 1px 0 rgba(23,50,77,0.06)",
      }}
    >
      <div
        className="relative overflow-hidden rounded-[3px]"
        style={{
          height: photoHeight,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover grayscale transition-[filter] duration-500 ease-out group-hover/print:grayscale-0"
        />
        <span
          aria-hidden
          className="absolute inset-0 opacity-100 mix-blend-multiply transition-opacity duration-500 ease-out group-hover/print:opacity-0"
          style={{
            backgroundImage,
          }}
        />
      </div>
      <figcaption className="mt-[10px] flex flex-col gap-[2px]">
        <span className="font-mono text-[10px] font-medium leading-[13px] tracking-[0.12em] text-alma-faint">
          {fig}
        </span>
        <span className="font-body text-[13px] leading-[17px] text-alma-ink">{title}</span>
        <span className="font-mono text-[10px] leading-[13px] tracking-[0.02em] text-alma-muted">{meta}</span>
      </figcaption>
    </figure>
  );
}
function HA1Component({ index, children, className }) {
  return (
    <p className={cn("font-mono text-xs font-medium leading-4 tracking-[0.1em]", className)}>
      <span className="text-alma-faint">[{index}]</span>
      <span className="text-alma-action"> {children}</span>
    </p>
  );
}
const cw = [
  {
    src: breakfast,
    fig: "FIG. 001",
    mobileRotate: 3,
    title: "Sunday breakfast at Mira's",
    meta: "12.07.2026 · Bandra West",
    rotate: 3,
    drop: false,
  },
  {
    src: bike,
    fig: "FIG. 002",
    mobileRotate: -2,
    title: "The bike Riya left behind",
    meta: "02.09.2026 · voice note, 0:42",
    rotate: -2,
    drop: true,
  },
  {
    src: fox,
    fig: "FIG. 003",
    mobileRotate: 1.5,
    title: "A fox at the edge of Hatta",
    meta: "21.08.2026 · with Dad",
    rotate: 0,
    drop: false,
  },
  {
    src: hill,
    fig: "FIG. 004",
    mobileRotate: -3,
    title: "The view from the hill",
    meta: "09.03.2019 · Rio de Janeiro",
    rotate: -3,
    drop: true,
  },
];
const F9 = {
  NOTE: "bg-person-violet text-person-violet-ink",
  PHOTO: "bg-person-blue text-person-blue-ink",
  VOICE: "bg-person-amber text-person-amber-ink",
};
const V9 = [
  {
    kind: "NOTE",
    text: "The name of the tailor in Satwa",
  },
  {
    kind: "PHOTO",
    text: "Sunday breakfast at Mira's",
  },
  {
    kind: "VOICE",
    text: "“She said she'd call every Tuesday”",
  },
  {
    kind: "NOTE",
    text: "آخر أحد قبل سفر ريا",
    rtl: true,
  },
  {
    kind: "PHOTO",
    text: "Bandra West, the old flat",
  },
  {
    kind: "VOICE",
    text: "Dad singing the boat song",
  },
];
const $9 = [
  {
    kind: "NOTE",
    text: "Core memory: her voice, kitchen radio on",
  },
  {
    kind: "PHOTO",
    text: "The morning she packed",
  },
  {
    kind: "VOICE",
    text: "Notes from the hospital car park",
  },
  {
    kind: "NOTE",
    text: "Grandma's kabsa recipe",
  },
  {
    kind: "PHOTO",
    text: "A fox at the edge of Hatta",
  },
  {
    kind: "NOTE",
    text: "First day at the new job",
  },
];
function Uw1Component({ kind, text, rtl, duplicate }) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex h-[42px] shrink-0 items-center gap-[10px] rounded-full border border-alma-hairline bg-white py-[9px] pe-4 ps-[9px]"
    >
      <span
        className={`shrink-0 rounded-full px-[9px] py-[4px] font-body text-[11px] font-semibold leading-[14px] tracking-[0.1em] ${F9[kind]}`}
      >
        {kind}
      </span>
      <span className="whitespace-nowrap font-body text-[15px] leading-5 text-alma-ink" dir={rtl ? "rtl" : undefined}>
        {text}
      </span>
    </li>
  );
}
function Dw1Component({ items, reverse, seconds }) {
  return (
    <ul
      className={`flex w-max items-start gap-[10px] motion-reduce:animate-none lg:gap-3 ${reverse ? "motion-safe:animate-[landing-marquee-reverse_var(--dur)_linear_infinite]" : "motion-safe:animate-[landing-marquee_var(--dur)_linear_infinite]"}`}
      style={{
        "--dur": `${seconds}s`,
      }}
    >
      {items.map((r) => (
        <Uw1Component key={r.text} {...r} />
      ))}
      {items.map((r) => (
        <Uw1Component key={`${r.text}-dup`} {...r} duplicate />
      ))}
    </ul>
  );
}
function U9Component() {
  const eRef = React.useRef(null);
  return (
    <section className="flex flex-col gap-7 bg-alma-canvas px-0 pb-[72px] pt-10 lg:gap-16 lg:pb-[112px] lg:pt-[120px]">
      <div ref={eRef} className="flex flex-col gap-7 px-6 md:px-12 lg:flex-row lg:items-start lg:gap-6 lg:px-[136px]">
        <HA1Component index="01" className="lg:w-[266px] lg:shrink-0">
          THE IDEA
        </HA1Component>
        <D9Component
          triggerRef={eRef}
          className="font-body text-[30px] leading-9 tracking-[-0.03em] text-alma-ink sm:text-[40px] sm:leading-[46px] md:leading-[48px] lg:w-[878px] lg:text-[56px] lg:leading-[63px] lg:tracking-[-0.035em]"
          segments={[
            {
              text: "The moments you'll want back never arrive as files. They come as a sentence on the way home, a voice note at midnight, a photo you never got round to labelling.",
            },
            {
              text: "Alma catches them where you already are.",
              className: "font-editorial italic text-alma-action",
              fill: false,
            },
          ]}
        />
      </div>
      <div className="flex flex-col items-center gap-[18px] lg:gap-6">
        <ul className="grid w-full grid-cols-2 justify-items-center gap-4 px-6 md:gap-6 md:px-12 lg:hidden">
          {cw.map((t, n) => (
            <li key={t.fig} className={n % 2 === 1 ? "pt-6" : undefined}>
              <Ue1Component delay={n * 0.06} direction="up">
                <Lw1Component
                  src={t.src}
                  fig={t.fig}
                  title={t.title}
                  meta={t.meta}
                  rotate={t.mobileRotate}
                  sizeClass="w-[155px] md:w-[270px]"
                  photoHeight={144}
                />
              </Ue1Component>
            </li>
          ))}
        </ul>
        <ul className="hidden w-full items-start justify-center gap-7 px-[136px] lg:flex">
          {cw.map((t, n) => (
            <li key={t.fig} className={t.drop ? "pt-9" : undefined}>
              <Ue1Component delay={n * 0.06} direction="up">
                <Lw1Component src={t.src} fig={t.fig} title={t.title} meta={t.meta} rotate={t.rotate} />
              </Ue1Component>
            </li>
          ))}
        </ul>
        <p className="px-6 text-center font-mono text-[10px] leading-[13px] tracking-[0.04em] text-alma-faint lg:text-[11px] lg:tracking-[0.04em]">
          <span className="lg:hidden">Tap a print to develop it.</span>
          <span className="hidden lg:inline">
            Hover a print to develop it. Every one of these was a WhatsApp message first.
          </span>
        </p>
      </div>
      <div className="relative h-24 w-full overflow-hidden lg:h-[104px]">
        <div className="absolute start-[-20px] top-0 lg:start-[-40px]">
          <Dw1Component items={V9} seconds={52} />
        </div>
        <div className="absolute start-[-110px] top-[50px] lg:start-[-140px] lg:top-[56px]">
          <Dw1Component items={$9} seconds={64} reverse />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 w-[72px] lg:w-[200px]"
          style={{
            backgroundImage: "linear-gradient(90deg, #f6f9fc, rgba(246,249,252,0))",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 end-0 w-[72px] lg:w-[200px]"
          style={{
            backgroundImage: "linear-gradient(270deg, #f6f9fc, rgba(246,249,252,0))",
          }}
        />
      </div>
    </section>
  );
}
function XaComponent({ index, label, title, emphasis, lede, className, onDark }) {
  return (
    <Ue1Component
      className={cn(
        "flex w-full flex-col items-start gap-4 border-t pt-[22px] md:w-[619px] lg:w-[760px]",
        onDark ? "border-white/15" : "border-alma-line",
        className,
      )}
    >
      {onDark ? (
        <p className="font-mono text-xs font-medium leading-4 tracking-[0.1em]">
          <span className="text-alma-panel-label">[{index}]</span>
          <span className="text-alma-panel-text"> {label}</span>
        </p>
      ) : (
        <HA1Component index={index}>{label}</HA1Component>
      )}
      <h2
        className={cn(
          "font-body text-[38px] leading-[42px] tracking-[-0.04em] sm:text-[52px] sm:leading-[56px] md:leading-[60px] lg:text-[70px] lg:leading-[70px]",
          onDark ? "text-white" : "text-alma-ink",
        )}
      >
        {title}
        {emphasis ? (
          <>
            {" "}
            <span className={cn("font-editorial italic", onDark ? "text-alma-azure-deep" : "text-alma-action")}>
              {emphasis}
            </span>
          </>
        ) : null}
      </h2>
      {lede ? (
        <p
          className={cn(
            "max-w-[560px] font-body text-[17px] leading-[26px] md:text-[19px] md:leading-7",
            onDark ? "text-alma-panel-text" : "text-alma-muted",
          )}
        >
          {lede}
        </p>
      ) : null}
    </Ue1Component>
  );
}
const z9 = [7, 12, 18, 10, 21, 13, 8, 15, 20, 11, 9, 17, 12, 19, 7, 13, 10, 15, 8, 11];
const W9 = ["max-sm:h-[443px]", "max-sm:h-[463px]", "max-sm:h-[469px]"];
const H9 = [
  {
    n: 1,
    title: "Send it the way you already do",
    body: "Type, talk or snap a photo in WhatsApp. English, Arabic or both. No forms, no folders.",
  },
  {
    n: 2,
    title: "Alma asks one small question",
    body: "Just enough to find it later. Nothing is saved until you say keep it.",
  },
  {
    n: 3,
    title: "Ask for it, months later",
    body: "In your own words. Every answer shows you the message you actually sent.",
  },
];
function K9Component({ title, body }) {
  return (
    <div className="flex flex-col items-center gap-[6px] text-center md:items-start md:gap-1 md:text-start lg:items-center lg:gap-[6px] lg:text-center">
      <h3 className="font-body text-[22px] leading-7 tracking-[-0.025em] text-alma-ink md:text-[20px] md:leading-[26px] lg:text-[22px] lg:leading-7">
        {title}
      </h3>
      <p className="max-w-[330px] font-body text-[15px] leading-[23px] text-alma-muted md:max-w-[510px] lg:max-w-[330px]">
        {body}
      </p>
    </div>
  );
}
function G9Component() {
  return (
    <div className="flex min-h-[380px] flex-1 flex-col overflow-hidden rounded-3xl border border-alma-hairline bg-[#efeae2] shadow-[0_30px_60px_-36px_rgba(23,50,77,0.25)]">
      <div className="flex w-full items-center gap-[10px] bg-white px-4 py-3">
        <img src={iconWhatsapp} alt="" aria-hidden width={28} height={28} className="shrink-0" />
        <span className="flex flex-col gap-px">
          <span className="font-body text-sm leading-[18px] font-semibold text-[#111b21]">Alma</span>
          <span className="font-body text-[11px] leading-[14px] text-[#667781]">online</span>
        </span>
      </div>
      <div className="flex w-full flex-col items-end gap-[10px] px-4 pb-5 pt-6">
        <div className="flex flex-col gap-[6px] rounded-[10px] bg-[#d9fdd3] px-1 pb-[6px] pt-1">
          <img
            src={breakfast}
            alt="A breakfast table laid for several people"
            loading="lazy"
            decoding="async"
            className="h-[130px] w-full max-w-[276px] rounded-[7px] object-cover"
          />
          <p className="max-w-[268px] font-body text-[13px] leading-[18px] text-[#111b21]">
            Last Sunday before Riya leaves. Everyone ordered the same thing.
          </p>
          <p className="text-end font-body text-[10px] text-[#667781]">9:41 ✓✓</p>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] bg-[#d9fdd3] px-[10px] py-2">
          <MicIcon size={14} strokeWidth={1.8} className="shrink-0 text-[#54656f]" aria-hidden />
          <span className="flex items-center gap-[2px]" aria-hidden>
            {z9.map((e, t) => (
              <span
                key={t}
                className="w-[3px] rounded-[1.5px] bg-[rgba(84,101,111,0.7)]"
                style={{
                  height: e,
                }}
              />
            ))}
          </span>
          <span className="whitespace-nowrap font-body text-[10px] text-[#667781]">0:42 ✓✓</span>
        </div>
      </div>
    </div>
  );
}
function Q91() {
  return (
    <div className="flex min-h-[380px] flex-1 flex-col gap-[14px] overflow-hidden rounded-3xl border border-alma-hairline bg-gradient-to-b from-white to-alma-canvas pb-[18px] shadow-[0_30px_60px_-36px_rgba(23,50,77,0.25)]">
      <div className="flex w-full items-center gap-[10px] border-b border-alma-hairline bg-white px-4 py-3">
        <img src={logoMark} alt="" aria-hidden width={22} height={26} className="shrink-0" />
        <span className="flex min-w-0 flex-1 flex-col gap-px">
          <span
            className="font-brand text-sm font-bold text-alma-ink"
            style={{
              fontVariationSettings: '"SOFT" 0, "WONK" 1',
            }}
          >
            ALMA
          </span>
          <span className="font-body text-[11px] text-alma-muted">Your memory companion</span>
        </span>
        <span className="shrink-0 rounded-full border border-alma-line-accent bg-alma-soft px-[9px] py-[3px] font-body text-[11px] text-alma-action">
          Private
        </span>
      </div>
      <div className="flex w-full flex-col gap-3 px-[18px] pt-12">
        <div className="flex w-full items-start gap-[10px]">
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-alma-panel font-body text-xs font-semibold text-alma-ink">
            A
          </span>
          <span className="flex flex-col gap-1">
            <span className="font-body text-[11px] leading-[14px] text-alma-faint">ALMA · 9:42 AM</span>
            <span className="max-w-[290px] font-body text-[15px] leading-[22px] text-alma-ink">
              Keep this as a memory? I'll file it under <span className="text-alma-action">July</span>, with{" "}
              <span className="text-alma-action">Riya</span> and <span className="text-alma-action">Mira</span>.
            </span>
          </span>
        </div>
        <div className="flex items-start gap-[6px] ps-9">
          <span className="rounded-full border border-alma-line-accent bg-alma-panel py-[9px] pe-[15px] ps-[13px] font-body text-[13px] font-medium leading-[18px] tracking-[0.26px] text-alma-ink">
            Keep it
          </span>
          <span className="rounded-full border border-alma-hairline bg-white py-[9px] pe-[15px] ps-[13px] font-body text-[13px] font-medium leading-[18px] tracking-[0.26px] text-alma-muted">
            Edit tags
          </span>
        </div>
        <div className="flex w-full justify-end">
          <span className="rounded-2xl rounded-br-[4px] bg-alma-panel px-3 py-2 font-body text-sm text-alma-ink">
            Keep it.
          </span>
        </div>
        <div className="flex w-full items-center gap-3 rounded-[14px] border border-alma-hairline bg-white py-[10px] pe-3 ps-[10px]">
          <img
            src={breakfast}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="size-10 shrink-0 rounded-[9px] object-cover"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className="truncate font-body text-sm font-medium leading-[18px] text-alma-ink">
              Kept in your Memory Vault
            </span>
            <span className="truncate font-body text-xs leading-4 text-alma-faint">Photo · 12 Jul · Riya, Mira</span>
          </span>
          <span className="shrink-0 rounded-full border border-alma-line-accent bg-alma-canvas px-3 py-[5px] font-body text-xs text-alma-action">
            View
          </span>
        </div>
      </div>
    </div>
  );
}
function Y9Component() {
  return (
    <div className="flex min-h-[380px] flex-1 flex-col gap-3 overflow-hidden rounded-3xl border border-alma-hairline bg-gradient-to-b from-[#eef5fb] to-[#dceaf6] p-[18px] shadow-[0_30px_60px_-36px_rgba(23,50,77,0.25)]">
      <div className="flex w-full items-center gap-3 rounded-[14px] border border-alma-hairline bg-white py-2 pe-2 ps-4">
        <p className="min-w-0 flex-1 font-body text-sm leading-[21px] text-alma-ink">
          What was that breakfast place before Riya left?
        </p>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-alma-action">
          <ArrowUp size={16} strokeWidth={2} className="text-white" aria-hidden />
        </span>
      </div>
      <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white">
        <img
          src={breakfast}
          alt="A breakfast table laid for several people"
          loading="lazy"
          decoding="async"
          className="h-[120px] w-full object-cover"
        />
        <div className="flex w-full flex-col gap-1 px-[14px] pb-[14px] pt-3">
          <p className="font-body text-base font-medium text-alma-ink">Sunday breakfast at Mira's</p>
          <p className="font-body text-xs leading-4 text-alma-faint">Sunday, 12 Jul 2026 · Bandra West</p>
          <div className="mt-1 flex w-full flex-col gap-1 rounded-[10px] border border-alma-line-accent bg-alma-soft px-3 py-[10px]">
            <p className="font-body text-[9px] font-semibold tracking-[0.9px] text-alma-muted">WRITTEN BY ALMA</p>
            <p className="font-body text-[13px] leading-[19px] text-alma-ink">
              You told me this was the last Sunday before Riya left for Berlin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function Q9Component() {
  return (
    <section
      id="how-it-works"
      className="flex scroll-mt-24 flex-col gap-7 bg-white px-6 md:px-12 py-14 lg:gap-16 lg:px-[136px] lg:py-[140px]"
    >
      <XaComponent
        index="02"
        label="HOW IT WORKS"
        title="Keep a memory in"
        emphasis="ten seconds."
        lede="Follow one Sunday breakfast from a WhatsApp message in July to an answer in November. You only do the sending and the asking."
      />
      <div className="flex flex-col">
        <div className="relative hidden h-7 w-full lg:block" aria-hidden>
          <div className="absolute start-[15.75%] top-[14px] h-px w-[68.5%] bg-alma-line" />
          <div className="absolute start-[15.75%] top-[13px] h-[2px] w-[34.25%] bg-alma-core" />
          {[
            {
              left: "14.55%",
              active: true,
              n: 1,
            },
            {
              left: "48.8%",
              active: false,
              n: 2,
            },
            {
              left: "83.05%",
              active: false,
              n: 3,
            },
          ].map((e) => (
            <div
              key={e.n}
              className={`absolute top-0 flex size-7 items-center justify-center rounded-full border font-body text-xs font-medium ${e.active ? "border-alma-action bg-alma-action text-white" : "border-alma-line-strong bg-white text-alma-faint"}`}
              style={{
                insetInlineStart: e.left,
              }}
            >
              {e.n}
            </div>
          ))}
        </div>
        <ol className="flex flex-col gap-6 pt-6 md:gap-9 lg:flex-row lg:items-stretch lg:gap-6 lg:pt-[22px]">
          {H9.map((e, t) => (
            <li key={e.n} className={`flex flex-1 flex-col ${W9[t]}`}>
              <Ue1Component
                delay={t * 0.08}
                className="flex h-full flex-col items-center gap-5 overflow-hidden md:items-start md:gap-5 lg:items-center"
              >
                <div className="flex flex-col items-center gap-5 md:w-full md:flex-row md:items-start md:gap-4 lg:flex-col lg:items-center lg:gap-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-alma-line-strong bg-white font-body text-xs font-medium text-alma-faint lg:hidden">
                    {e.n}
                  </span>
                  <K9Component title={e.title} body={e.body} />
                </div>
                <div className="flex w-full flex-col md:max-w-[558px] lg:max-w-none lg:flex-1">
                  {t === 0 ? <G9Component /> : t === 1 ? <Q91 /> : <Y9Component />}
                </div>
              </Ue1Component>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
const Xu =
  "group/tile flex h-full flex-col gap-7 overflow-hidden rounded-[28px] border border-alma-hairline bg-white p-6 transition-shadow duration-300 hover:shadow-[0_30px_60px_-40px_rgba(23,50,77,0.3)] lg:p-9";
const Zu =
  "flex min-h-px flex-1 flex-col gap-[14px] overflow-hidden rounded-[20px] border border-[rgba(82,103,121,0.08)] p-5";
function Ed1Component({ eyebrow, title, body }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-body text-xs font-medium leading-4 tracking-[0.14em] text-alma-action">{eyebrow}</p>
      <h3 className="font-body text-[22px] leading-[30px] tracking-[-0.03em] text-alma-ink lg:text-[26px] lg:leading-[34px]">
        {title}
      </h3>
      <p className="max-w-[440px] font-body text-[15px] leading-6 text-alma-muted">{body}</p>
    </div>
  );
}
function Kh1Component({ day, date, count, photos, style }) {
  return (
    <div
      className="flex h-[66px] w-full shrink-0 items-start gap-[14px] transition-transform duration-300 ease-out motion-safe:group-hover/tile:-translate-y-[3px]"
      style={{
        ...style,
        transitionDelay: "var(--day-delay, 0ms)",
      }}
    >
      <div className="flex w-[112px] shrink-0 flex-col gap-[2px] self-stretch border-e border-[rgba(82,103,121,0.1)] pe-[10px]">
        <span className="font-display text-[13px] font-semibold leading-4 text-alma-ink">{day}</span>
        <span className="font-body text-[10px] leading-[13px] text-alma-faint">{date}</span>
        <span className="font-body text-[10px] leading-[13px] text-alma-faint">{count}</span>
      </div>
      <div className="flex min-w-0 gap-2 overflow-hidden">
        {photos.map((i, o) => (
          <img
            key={o}
            src={i}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="size-[66px] shrink-0 rounded-[10px] border-2 border-white object-cover shadow-[0_4px_10px_-4px_rgba(41,94,133,0.25)]"
          />
        ))}
      </div>
    </div>
  );
}
function J9Component() {
  return (
    <div className={Xu}>
      <Ed1Component
        eyebrow="GALLERY"
        title="Scroll back through your days."
        body="Every photo you send, sorted by day, with people and places already tagged."
      />
      <div
        className={Zu}
        style={{
          backgroundImage: "linear-gradient(150.11deg, #f8fbfd 13.139%, #eef4f9 86.131%)",
        }}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <span className="flex flex-col gap-[2px]">
            <span className="font-body text-[11px] leading-[14px] text-alma-faint">3D memory gallery</span>
            <span className="font-display text-[15px] font-semibold leading-[18px] text-alma-ink">
              Everything you've kept
            </span>
          </span>
          <span className="flex shrink-0 rounded-full border border-[rgba(82,103,121,0.12)] bg-white p-[3px]">
            {["Timeline", "Orbit", "Grid"].map((e, t) => (
              <span
                key={e}
                className={`rounded-full px-[10px] py-[5px] font-body text-[11px] leading-[14px] ${t === 0 ? "bg-alma-panel font-medium text-alma-ink" : "text-alma-muted"}`}
              >
                {e}
              </span>
            ))}
          </span>
        </div>
        <div className="flex w-full flex-wrap items-center gap-[6px]">
          {["All", "People", "Places", "Favourites"].map((e, t) => (
            <span
              key={e}
              className={`rounded-full px-[10px] py-1 font-body text-[11px] leading-[14px] ${t === 0 ? "border border-alma-line-accent bg-alma-panel text-alma-ink" : "border border-[rgba(82,103,121,0.12)] bg-white text-alma-muted"}`}
            >
              {e}
            </span>
          ))}
          <span className="ms-auto whitespace-nowrap font-body text-[11px] leading-[14px] text-alma-faint">
            1,284 photos across 214 days
          </span>
        </div>
        <Kh1Component
          style={{
            "--day-delay": "0ms",
          }}
          day="Today"
          date="2 September 2026"
          count="4 photos"
          photos={[fox, breakfast, bike, hill]}
        />
        <Kh1Component
          style={{
            "--day-delay": "60ms",
          }}
          day="Yesterday"
          date="1 September 2026"
          count="6 photos"
          photos={[breakfast, bike, hill, fox, breakfast, bike]}
        />
        <Kh1Component
          style={{
            "--day-delay": "120ms",
          }}
          day="Saturday"
          date="29 August 2026"
          count="11 photos"
          photos={[bike, hill, fox, breakfast, bike, hill]}
        />
      </div>
    </div>
  );
}
const hw = [31, 39, 19, 13, 35, 29, 33, 48, 65, 39, 57, 96];
function X9Component() {
  return (
    <div className={Xu}>
      <Ed1Component
        eyebrow="YOUR JOURNEY"
        title="Watch your year take shape."
        body="How much you've kept, and the memories you return to most."
      />
      <div
        className={Zu}
        style={{
          backgroundImage: "linear-gradient(148.42deg, #f8fbfd 13.139%, #eef4f9 86.131%)",
        }}
      >
        <div className="flex shrink-0 flex-col gap-[2px]">
          <span className="font-body text-[40px] font-semibold leading-[52px] tracking-[-0.03em] text-alma-ink lg:text-[48px] lg:leading-[62px]">
            4,281
          </span>
          <span className="font-body text-[15px] leading-5 text-alma-ink">memories kept</span>
          <span className="font-body text-[13px] leading-[17px] text-alma-faint">across 214 days, 96 revisited</span>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-[10px] rounded-[14px] border border-[rgba(82,103,121,0.1)] bg-white px-[14px] pb-3 pt-[14px]">
          <span className="font-body text-xs leading-4 text-alma-muted">Last 12 weeks</span>
          <div className="flex h-24 w-full items-end gap-2" aria-hidden>
            {hw.map((e, t) => (
              <div
                key={t}
                className="min-w-px flex-1 origin-bottom rounded-t transition-transform duration-500 ease-out motion-safe:scale-y-[0.82] motion-safe:group-hover/tile:scale-y-100"
                style={{
                  height: e,
                  transitionDelay: `${t * 26}ms`,
                  background:
                    t === hw.length - 1 ? "#4a90c4" : "linear-gradient(150.11deg, #c8e1f2 13.139%, #e6f0f8 86.131%)",
                }}
              />
            ))}
          </div>
          <div className="flex w-full justify-between font-body text-[11px] leading-[14px] text-alma-faint">
            {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((e) => (
              <span key={e}>{e}</span>
            ))}
          </div>
        </div>
        <div className="flex w-full shrink-0 gap-[10px]">
          {[
            {
              v: "6h 42m",
              l: "OF VOICE SAVED",
            },
            {
              v: "27",
              l: "PEOPLE NAMED",
            },
          ].map((e) => (
            <div
              key={e.l}
              className="flex min-w-px flex-1 flex-col gap-1 rounded-xl border border-[rgba(82,103,121,0.1)] bg-white px-[14px] py-3"
            >
              <span className="font-body text-[22px] leading-[29px] text-alma-ink">{e.v}</span>
              <span className="font-body text-[11px] leading-[14px] tracking-[0.08em] text-alma-faint">{e.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ShComponent({ time, title, meta, alma }) {
  return (
    <div
      className={`flex h-[73px] w-full shrink-0 items-start gap-3 rounded-xl border px-3 py-[11px] ${alma ? "border-[rgba(40,94,133,0.18)] bg-alma-soft transition-transform duration-300 ease-out motion-safe:group-hover/tile:-translate-y-[3px]" : "border-[rgba(82,103,121,0.08)] bg-alma-subtle"}`}
    >
      <span
        className={`h-[34px] w-[3px] shrink-0 origin-top rounded-sm ${alma ? "bg-[rgba(40,94,133,0.7)] transition-transform duration-300 ease-out motion-safe:group-hover/tile:scale-y-125" : "bg-[rgba(82,103,121,0.22)]"}`}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span
          className={`font-body text-[11px] font-medium leading-[14px] tracking-[0.02em] ${alma ? "text-[rgba(23,50,77,0.9)]" : "text-[rgba(82,103,121,0.6)]"}`}
        >
          {time}
        </span>
        <span className="font-body text-[13px] font-medium leading-[17px] tracking-[0.02em] text-alma-ink">
          {title}
        </span>
        <span className="font-body text-[11px] leading-[14px] tracking-[0.02em] text-[rgba(82,103,121,0.5)]">
          {meta}
        </span>
      </span>
    </div>
  );
}
function Z9Component() {
  return (
    <div className={Xu}>
      <Ed1Component
        eyebrow="CALENDAR"
        title="Mention a plan, find it on your calendar."
        body="Connect Google Calendar once. Plans from chat land in your day."
      />
      <div
        className={Zu}
        style={{
          backgroundImage: "linear-gradient(150.11deg, #f8fbfd 13.14%, #eef4f9 86.13%)",
        }}
      >
        <div className="flex h-[607px] w-full shrink-0 flex-col gap-[18px] rounded-[18px] border border-[rgba(82,103,121,0.1)] bg-white/90 p-5">
          <div className="flex shrink-0 flex-col gap-[5px]">
            <span className="font-body text-[10px] font-medium leading-[13px] tracking-[0.12em] text-[rgba(82,103,121,0.42)]">
              TODAY
            </span>
            <span className="font-display text-[17px] font-semibold leading-5 tracking-[0.01em] text-alma-ink">
              Wednesday, 2 September
            </span>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-[10px]">
            <ShComponent time="09:30" title="Standup" meta="20 min" />
            <ShComponent time="11:00" title="Dentist" meta="Bandra West" alma />
            <ShComponent time="18:30" title="Call with Riya" meta="Berlin · 3:00 PM there" />
          </div>
          <div className="h-px w-full shrink-0 bg-[rgba(82,103,121,0.09)]" />
          <div className="flex w-full shrink-0 flex-col gap-[10px]">
            <div className="flex items-center gap-[7px]">
              <BellIcon size={13} strokeWidth={1.2} className="text-[rgba(82,103,121,0.45)]" aria-hidden />
              <span className="font-body text-[10px] font-medium leading-[13px] tracking-[0.12em] text-[rgba(82,103,121,0.42)]">
                FROM ALMA
              </span>
            </div>
            {[
              {
                t: "Book Mum's birthday cake",
                m: "from WhatsApp, 28 Aug",
              },
              {
                t: "Back up the Delhi photos",
                m: "you asked on 30 Aug",
              },
            ].map((e) => (
              <div
                key={e.t}
                className="flex h-[53px] w-full shrink-0 items-center gap-[10px] rounded-xl border border-[rgba(82,103,121,0.08)] bg-alma-subtle p-[10px] ps-3"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="truncate font-body text-[12.5px] font-medium leading-4 tracking-[0.02em] text-[rgba(23,50,77,0.95)]">
                    {e.t}
                  </span>
                  <span className="truncate font-body text-[10.5px] leading-[14px] tracking-[0.02em] text-[rgba(82,103,121,0.45)]">
                    {e.m}
                  </span>
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(82,103,121,0.12)] bg-white">
                  <CheckIcon size={14} strokeWidth={1.2} className="text-[rgba(40,94,133,0.9)]" aria-hidden />
                </span>
              </div>
            ))}
          </div>
          <div className="flex w-full shrink-0 flex-col gap-[6px] rounded-[13px] border border-[rgba(40,94,133,0.16)] bg-alma-soft px-[13px] pb-[13px] pt-3">
            <div className="flex items-center gap-[6px]">
              <Sparkles size={13} strokeWidth={1.2} className="text-[rgba(40,94,133,0.9)]" aria-hidden />
              <span className="font-body text-[10px] font-semibold leading-[13px] tracking-[0.1em] text-[rgba(23,50,77,0.85)]">
                ALMA
              </span>
            </div>
            <p className="font-body text-[11.5px] leading-[17px] tracking-[0.01em] text-[rgba(23,50,77,0.85)]">
              You have a free stretch from 2 to 5 today - the longest this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function WlComponent({ Icon, title, children, action, delay = 0 }) {
  return (
    <div
      className="flex min-w-px flex-1 flex-col rounded-xl border border-alma-line bg-alma-subtle transition-transform duration-300 ease-out motion-safe:group-hover/tile:-translate-y-[3px]"
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between border-b border-[rgba(213,226,236,0.7)] px-[13px] py-[13px]">
        <span className="flex items-center gap-[6px]">
          {<Icon size={16} strokeWidth={1.6} className="text-alma-line-accent" aria-hidden />}
          <span className="font-body text-base font-medium tracking-[0.32px] text-alma-ink">{title}</span>
        </span>
        <PlusIcon size={16} strokeWidth={1.6} className="text-[rgba(82,103,121,0.5)]" aria-hidden />
      </div>
      <div className="flex flex-1 flex-col p-[10px]">{children}</div>
      <div className="flex items-center justify-center gap-[6px] px-3 pb-3">
        <PlusIcon size={16} strokeWidth={1.6} className="text-[rgba(82,103,121,0.6)]" aria-hidden />
        <span className="font-body text-[10px] tracking-[0.2px] text-[rgba(82,103,121,0.6)]">{action}</span>
      </div>
    </div>
  );
}
function EhComponent({ title, body, tag, age, when }) {
  return (
    <div className="flex flex-1 flex-col gap-[10px] rounded-md border-[0.5px] border-alma-line bg-white/40 p-[10px]">
      <div className="flex flex-col gap-1">
        <p className="font-body text-xs font-medium tracking-[0.24px] text-alma-ink">{title}</p>
        <p className="font-body text-[10px] leading-[13px] tracking-[0.2px] text-[rgba(82,103,121,0.5)]">{body}</p>
      </div>
      {when ? (
        <div className="flex items-center gap-[10px]">
          <TimerIcon size={12} strokeWidth={1.6} className="text-[rgba(82,103,121,0.7)]" aria-hidden />
          <span className="font-body text-[10px] tracking-[0.2px] text-[rgba(82,103,121,0.8)]">{when}</span>
        </div>
      ) : null}
      <div className="mt-auto flex items-center justify-between">
        <span className="rounded-3xl border-[0.5px] border-[rgba(82,103,121,0.2)] px-2 py-1 font-body text-[10px] font-light tracking-[0.1px] text-[rgba(82,103,121,0.7)] opacity-80">
          {tag}
        </span>
        <span className="font-body text-[10px] tracking-[0.2px] text-[rgba(82,103,121,0.6)]">{age}</span>
      </div>
    </div>
  );
}
function EB1Component() {
  return (
    <div className={Xu}>
      <Ed1Component
        eyebrow="MEMORIES"
        title="Lists, reminders and saved images."
        body="Said once in a message, sorted for you automatically."
      />
      <div
        className={Zu}
        style={{
          backgroundImage: "linear-gradient(155.38deg, #f8fbfd 13.139%, #eef4f9 86.131%)",
        }}
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <WlComponent delay={0} Icon={Images} title="Memories" action="Capture the moment">
            <EhComponent
              title="Summer road trip"
              body="The laughter echoed as we drove through the winding roads of the countryside."
              tag="Family"
              age="3 Days"
            />
          </WlComponent>
          <WlComponent delay={55} Icon={BellIcon} title="Pending reminders" action="Add to reminders">
            <EhComponent
              title="Make avocado toast"
              body="The joy was palpable as we tossed our caps into the air, celebrating new beginnings."
              when="14 July 2026, 10:00 AM"
              tag="Recipe"
              age="1 Week"
            />
          </WlComponent>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <WlComponent delay={110} Icon={ListTodo} title="To-do lists" action="Add to lists">
            <EhComponent title="Groceries" body="Rice, lemons, eggs" tag="Food" age="1 Week" />
          </WlComponent>
          <WlComponent delay={165} Icon={Images} title="Saved Images" action="Capture the moment">
            <div className="flex flex-1 overflow-hidden rounded-md border-[0.5px] border-alma-line">
              <img
                src={hill}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="h-[97px] w-full object-cover"
              />
            </div>
          </WlComponent>
        </div>
      </div>
    </div>
  );
}
function TB1Component() {
  return (
    <section
      id="the-app"
      className="flex scroll-mt-24 flex-col gap-7 bg-alma-canvas px-6 md:px-12 pb-16 pt-14 lg:gap-16 lg:px-[136px] lg:pb-[140px] lg:pt-[120px]"
    >
      <XaComponent
        index="03"
        label="THE APP"
        title="Everything you've kept,"
        emphasis="in one calm place."
        lede="Your vault opens in any browser and on your phone. These are the screens people come back to most."
      />
      <div className="flex w-full flex-col gap-[14px] lg:gap-4">
        <div className="flex w-full flex-col gap-[14px] md:h-[578px] md:flex-row md:items-stretch md:gap-5 lg:h-[646px]">
          <Ue1Component className="w-full max-sm:h-[470px] md:h-full md:w-1/2 lg:h-full lg:w-[57.88%]">
            <J9Component />
          </Ue1Component>
          <Ue1Component delay={0.08} className="w-full max-sm:h-[582px] md:h-full md:w-1/2 lg:h-full lg:w-[40.75%]">
            <X9Component />
          </Ue1Component>
        </div>
        <div className="flex w-full flex-col gap-[14px] md:h-[583px] md:flex-row md:items-stretch md:gap-5 lg:h-[672px]">
          <Ue1Component className="w-full max-sm:h-[518px] md:h-full md:w-1/2 lg:h-full lg:w-[40.75%]">
            <Z9Component />
          </Ue1Component>
          <Ue1Component delay={0.08} className="w-full max-sm:h-[588px] md:h-full md:w-1/2 lg:h-full lg:w-[57.88%]">
            <EB1Component />
          </Ue1Component>
        </div>
      </div>
    </section>
  );
}
const nB = [5, 11, 16, 8, 14, 6, 15, 9, 5, 12, 7, 13];
const Hl = [
  {
    id: "family",
    title: "Family far apart",
    blurb: "Keep their voices close.",
    dot: "#4A90C4",
    fromDesign: true,
    later: "TWO MONTHS LATER",
    turns: [
      {
        from: "user",
        voice: true,
        text: "Voice note from Dad, singing the old boat song again",
      },
      {
        from: "alma",
        text: "Keep it under Family, with Dad? I'll keep the audio and a transcript you can correct.",
      },
      {
        from: "user",
        text: "What was the song Dad sang in March?",
      },
      {
        from: "alma",
        text: "“The old boat song”, 14 March. The recording is 0:58, and you can play it from here.",
      },
    ],
    keeps: ["Voice · 0:58", "Family", "Dad", "14 Mar"],
  },
  {
    id: "caring",
    title: "Caring for a parent",
    blurb: "Never lose track of the details.",
    dot: "#8A5A24",
    later: "SIX WEEKS LATER",
    turns: [
      {
        from: "user",
        text: "Dr Rao moved Mum's blood test to the 9th, fasting from midnight",
      },
      {
        from: "alma",
        text: "Noted under Mum's care. Shall I remind you the evening before, so the fasting starts on time?",
      },
      {
        from: "user",
        text: "When did they last change Mum's dose?",
      },
      {
        from: "alma",
        text: "12 August — you told me Dr Rao halved the evening tablet. The note is filed with that appointment.",
      },
    ],
    keeps: ["Note", "Mum's care", "Dr Rao", "12 Aug"],
  },
  {
    id: "new-parents",
    title: "New parents",
    blurb: "The firsts you'll want to find again.",
    dot: "#4A4A99",
    later: "A YEAR LATER",
    turns: [
      {
        from: "user",
        voice: true,
        text: "She said something that was almost 'bath'. Twice.",
      },
      {
        from: "alma",
        text: "Keeping it as a first, with the date. Want me to put it alongside the other firsts?",
      },
      {
        from: "user",
        text: "What was her first proper word?",
      },
      {
        from: "alma",
        text: "“Bath”, 3 November, in a voice note you sent that evening. The clip is 0:14.",
      },
    ],
    keeps: ["Voice · 0:14", "Firsts", "Noor", "3 Nov"],
  },
  {
    id: "life-log",
    title: "Your own life log",
    blurb: "A diary that answers back.",
    dot: "#A8D0E8",
    later: "THREE MONTHS LATER",
    turns: [
      {
        from: "user",
        text: "Handed in notice today. Relieved more than anything.",
      },
      {
        from: "alma",
        text: "Kept under Work, 4 June. Do you want me to ask how you feel about it in a month?",
      },
      {
        from: "user",
        text: "How did I feel the week I resigned?",
      },
      {
        from: "alma",
        text: "Relieved, you wrote on the 4th. By the 11th you said it was the first week you had slept properly.",
      },
    ],
    keeps: ["Note", "Work", "4 Jun", "11 Jun"],
  },
];
function EpComponent({ turn, shown }) {
  const n = turn.from === "user";
  return (
    <div
      className={`flex w-full transition-[opacity,transform] duration-[380ms] ease-out motion-reduce:transition-none ${shown ? "translate-y-0 opacity-100" : "translate-y-[10px] opacity-0"} ${n ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex w-full max-w-[86%] flex-col gap-[6px] px-3 py-[9px] lg:max-w-[294px] ${n ? "rounded-2xl rounded-br-[4px] bg-alma-panel" : "rounded-2xl rounded-bl-[4px] bg-alma-sunken"}`}
      >
        {turn.voice ? (
          <span className="flex items-center gap-[2px]" aria-hidden>
            {nB.map((r, s) => (
              <span
                key={s}
                className="w-[3px] rounded-[1.5px] bg-alma-action"
                style={{
                  height: r,
                }}
              />
            ))}
          </span>
        ) : null}
        <p className="font-body text-sm leading-5 text-alma-ink">{turn.text}</p>
      </div>
    </div>
  );
}
function RB1Component({ shown }) {
  return (
    <div
      aria-hidden
      className={`flex w-full justify-start transition-opacity duration-200 ease-out motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}
    >
      <span className="flex items-center gap-[5px] rounded-2xl rounded-bl-[4px] bg-alma-sunken px-[14px] py-[15px]">
        {[0, 1, 2].map((t) => (
          <span
            key={t}
            className="block size-[6px] rounded-full bg-alma-faint motion-safe:animate-[typing-dot_1.1s_ease-in-out_infinite]"
            style={{
              animationDelay: `${t * 0.16}s`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
function Fw1Component({ turn, typing, shown }) {
  return (
    <div className="grid w-full">
      <div className="col-start-1 row-start-1">
        <EpComponent turn={turn} shown={shown} />
      </div>
      <div className="col-start-1 row-start-1 self-start">
        <RB1Component shown={typing} />
      </div>
    </div>
  );
}
const Ap = [340, 640, 900, 640, 520, 640, 900, 660];
const Ap_length = Ap.length;
function SB1Component() {
  const [e, setE] = React.useState(Hl[0].id);
  const nRef = React.useRef(null);
  const onMouseLeave = () => {
    if (nRef.current !== null) {
      window.clearTimeout(nRef.current);
      nRef.current = null;
    }
  };
  const s = (m) => {
    onMouseLeave();
    setE(m);
  };
  const i = (m) => {
    onMouseLeave();
    nRef.current = window.setTimeout(() => setE(m), 140);
  };
  React.useEffect(() => onMouseLeave, []);
  const o = useReducedMotion();
  const a = Hl.find((m) => m.id === e) ?? Hl[0];
  const lRef = React.useRef(null);
  const c = useInView(lRef, {
    once: true,
    amount: 0.25,
  });
  const [d, setD] = React.useState(false);
  React.useEffect(() => {
    const m = window.setTimeout(() => setD(true), 5000);
    return () => window.clearTimeout(m);
  }, []);
  const f = c || d;
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    if (o) {
      setP(Ap_length);
      return;
    }
    if (!f) {
      return;
    }
    setP(0);
    let m = 0;
    let b = window.setTimeout(function x() {
      m += 1;
      setP(m);
      if (m < Ap_length) {
        b = window.setTimeout(x, Ap[m]);
      }
    }, Ap[0]);
    return () => window.clearTimeout(b);
  }, [f, e, o]);
  return (
    <section
      id="who-its-for"
      className="flex scroll-mt-24 flex-col gap-7 bg-white px-6 md:px-12 py-14 lg:gap-16 lg:px-[136px] lg:py-[140px]"
    >
      <XaComponent
        index="04"
        label="TRY IT"
        title="Watch Alma"
        emphasis="at work."
        lede="Pick a life that sounds like yours. Each one is a real kind of conversation, months apart."
      />
      <div className="flex w-full flex-col items-start gap-[18px] lg:flex-row lg:gap-4">
        <div
          role="tablist"
          aria-label="Who it's for"
          className="-mx-6 flex w-[calc(100%+48px)] shrink-0 snap-x snap-mandatory gap-2 overflow-x-auto px-6 pb-1 md:-mx-12 md:w-[calc(100%+96px)] md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:w-[500px] lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {Hl.map((m) => {
            const b = m.id === e;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={b}
                aria-controls={`panel-${m.id}`}
                onClick={() => s(m.id)}
                onFocus={() => s(m.id)}
                onMouseEnter={() => i(m.id)}
                onMouseLeave={onMouseLeave}
                className={`flex shrink-0 snap-start items-center gap-[10px] rounded-full border px-4 py-[11px] text-start transition-colors lg:w-full lg:h-[77px] lg:items-start lg:gap-3 lg:rounded-2xl lg:px-[18px] lg:py-4 ${b ? "border-alma-line-accent" : "border-alma-hairline bg-white hover:bg-alma-subtle"}`}
                style={
                  b
                    ? {
                        backgroundImage: "linear-gradient(150.11deg, #EAF3FA 13.14%, #DCEAF6 86.13%)",
                      }
                    : undefined
                }
              >
                <span
                  className="block size-2 shrink-0 rounded-full lg:mt-[7px]"
                  style={{
                    backgroundColor: m.dot,
                  }}
                />
                <span className="flex flex-col gap-[3px]">
                  <span className="whitespace-nowrap font-body text-[15px] leading-5 text-alma-ink lg:whitespace-normal lg:text-[17px] lg:leading-[22px]">
                    {m.title}
                  </span>
                  <span className="hidden font-body text-sm leading-[18px] text-alma-muted lg:block">{m.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          id={`panel-${a.id}`}
          role="tabpanel"
          ref={lRef}
          className="flex w-full min-w-px flex-1 flex-col gap-[18px] rounded-[28px] p-5 lg:h-[586px] lg:p-7"
          style={{
            backgroundImage: "linear-gradient(150.11deg, #EEF5FB 13.14%, #DCEAF6 86.13%)",
          }}
        >
          <div key={a.id} className="flex w-full flex-col gap-[18px]">
            <div className="flex w-full flex-col gap-3 rounded-[20px] bg-white px-[18px] pb-[18px] pt-4 shadow-[0_24px_50px_-30px_rgba(23,50,77,0.2)]">
              <div className="flex items-center gap-[10px]">
                <span
                  className="size-7 shrink-0 rounded-full"
                  style={{
                    backgroundImage: "linear-gradient(150.11deg, #C8E1F2 13.14%, #A8D0E8 86.13%)",
                  }}
                />
                <span className="flex flex-col gap-px">
                  <span className="font-body text-sm font-semibold leading-[18px] text-alma-ink">Alma</span>
                  <span className="font-body text-[11px] leading-[14px] text-alma-faint">Example conversation</span>
                </span>
              </div>
              <EpComponent turn={a.turns[0]} shown={p >= 1} />
              <Fw1Component turn={a.turns[1]} typing={p === 2} shown={p >= 3} />
              <div
                className={`flex w-full justify-center transition-opacity duration-[380ms] ease-out motion-reduce:transition-none ${p >= 4 ? "opacity-100" : "opacity-0"}`}
              >
                <span className="rounded-full bg-[#e9f1f9] px-[10px] py-1 font-body text-[10px] leading-[13px] tracking-[0.1em] text-alma-muted">
                  {a.later}
                </span>
              </div>
              <EpComponent turn={a.turns[2]} shown={p >= 5} />
              <Fw1Component turn={a.turns[3]} typing={p === 6} shown={p >= 7} />
              <div className="flex h-[46px] w-full items-center gap-[10px] rounded-[14px] border border-alma-line bg-alma-subtle p-[6px] ps-4">
                <span className="min-w-px flex-1 font-body text-sm leading-[18px] text-alma-faint">
                  Ask Alma anything…
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-alma-action">
                  <ArrowUp size={14} strokeWidth={1.4} className="text-white" aria-hidden />
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-body text-xs font-medium leading-4 tracking-[0.14em] text-alma-action">
                WHAT ALMA KEEPS
              </p>
              <div className="flex flex-wrap gap-[6px]">
                {a.keeps.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-alma-line-accent bg-white px-[10px] py-[5px] font-body text-xs leading-4 text-alma-action"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function AB1Component() {
  return (
    <section
      id="the-vault"
      className="flex scroll-mt-24 flex-col gap-7 bg-alma-ink px-6 md:px-12 py-14 lg:gap-16 lg:px-[136px] lg:py-[140px]"
    >
      <Ue1Component className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex w-full flex-col gap-4 border-t border-alma-line/40 pt-[22px] lg:w-[640px]">
          <p className="font-mono text-xs font-medium leading-4 tracking-[0.1em]">
            <span className="text-alma-faint">[05]</span>
            <span className="text-alma-panel-label"> THE VAULT</span>
          </p>
          <h2 className="font-body text-[38px] leading-[42px] tracking-[-0.04em] text-white sm:text-[52px] sm:leading-[56px] lg:text-[70px] lg:leading-[70px]">
            Your whole life, <span className="font-editorial italic">closest first.</span>
          </h2>
        </div>
        <p className="font-body text-[17px] leading-[26px] text-alma-panel-text lg:w-[380px] lg:text-[19px] lg:leading-7">
          No folders to manage. This week sits at the centre and older years drift outward.{" "}
          <span className="lg:hidden">Tap any memory to open it.</span>
          <span className="hidden lg:inline">
            Open any memory to see what Alma wrote, who was there, and what happened around it.
          </span>
        </p>
      </Ue1Component>
      <Ue1Component delay={0.08} className="w-full lg:hidden">
        <img
          src={orbitPhone}
          alt="The ALMA gallery in orbit view on a phone, with this week at the centre"
          width={342}
          height={663}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto w-full max-w-[342px] md:max-w-[410px]"
        />
      </Ue1Component>
      <Ue1Component
        delay={0.08}
        className="hidden w-full overflow-hidden rounded-[20px] bg-alma-canvas lg:block"
        style={{
          boxShadow: "0 50px 100px -40px rgba(0,0,0,0.45)",
        }}
      >
        <div className="relative h-9 w-full shrink-0 bg-alma-subtle">
          <span className="absolute left-[14px] top-[13px] size-[10px] rounded-full bg-alma-line" />
          <span className="absolute left-[31px] top-[13px] size-[10px] rounded-full bg-alma-line" />
          <span className="absolute left-[48px] top-[13px] size-[10px] rounded-full bg-alma-line" />
          <span className="absolute inset-x-0 top-[10px] text-center font-body text-xs leading-4 text-alma-muted">
            Gallery · Orbit
          </span>
        </div>
        <div className="relative aspect-[1168/780] w-full overflow-hidden bg-alma-canvas">
          <img
            src={orbitStage}
            alt="The ALMA gallery in orbit view: this week at the centre, older years drifting outward, with one memory open"
            width={1140}
            height={780}
            loading="lazy"
            decoding="async"
            className="absolute top-0 h-full w-[97.6%]"
            style={{
              left: "1.199%",
            }}
          />
        </div>
      </Ue1Component>
    </section>
  );
}
const lB = "flex w-full items-center gap-3";
function Ss1Component({ n }) {
  return (
    <div className={lB}>
      <span className="font-mono text-[11px] leading-[14px] tracking-[0.1em] text-alma-faint">{n}</span>
      <span className="h-px min-w-px flex-1 bg-[rgba(23,50,77,0.08)]" />
    </div>
  );
}
function Is1Component({ title, body, nowrap }) {
  return (
    <div className="flex flex-col gap-2">
      <h3
        className={`font-body text-[22px] leading-[29px] tracking-[-0.02em] text-alma-ink ${nowrap ? "lg:whitespace-nowrap" : ""}`}
      >
        {title}
      </h3>
      <p className={`font-body text-[15px] leading-[23px] text-alma-muted ${nowrap ? "lg:whitespace-nowrap" : ""}`}>
        {body}
      </p>
    </div>
  );
}
const os = "flex flex-col gap-[18px] overflow-hidden rounded-[28px] p-6 lg:p-7";
const cB = [8, 31, 20, 25, 29, 13, 32, 16, 28, 26, 18, 32, 11];
const uB = [30, 23, 23, 30, 11, 32, 18, 26, 28, 16, 32, 13, 29, 24, 20, 31, 8, 31, 20, 25, 29];
const dB = [...cB, ...uB];
function Mw1Component({ tone }) {
  return (
    <>
      {dB.map((t, n) => (
        <span
          key={n}
          className={`w-[3px] shrink-0 rounded-[1.5px] ${tone}`}
          style={{
            height: t,
          }}
        />
      ))}
    </>
  );
}
function HB1Component() {
  return (
    <section className="flex flex-col gap-10 bg-alma-canvas px-6 md:px-12 py-20 lg:gap-16 lg:px-[136px] lg:py-[140px]">
      <Ue1Component className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex w-full flex-col gap-4 border-t border-alma-line pt-[22px] lg:w-[680px]">
          <p className="font-mono text-xs font-medium leading-4 tracking-[0.1em]">
            <span className="text-alma-faint">[06]</span>
            <span className="text-alma-action"> THE DETAILS</span>
          </p>
          <h2 className="font-body text-[38px] leading-[42px] tracking-[-0.04em] text-alma-ink sm:text-[52px] sm:leading-[56px] lg:text-[70px] lg:leading-[70px]">
            Small things that make you <span className="font-editorial italic text-alma-action">come back.</span>
          </h2>
        </div>
        <p className="font-body text-[17px] leading-[26px] text-alma-muted lg:w-[380px] lg:text-[19px] lg:leading-7">
          Built for the moment you need a memory, not for collecting them. Every detail saves you a step.
        </p>
      </Ue1Component>
      <div className="flex w-full flex-col gap-[14px] md:grid md:grid-cols-2 md:gap-x-[18px] md:gap-y-3 lg:flex lg:flex-col lg:gap-[14px]">
        <div className="flex w-full flex-col gap-[14px] md:[display:contents] lg:h-[415px] lg:flex lg:flex-row">
          <Ue1Component
            className={`group/search ${os} w-full lg:h-full lg:w-[66.44%]`}
            style={{
              backgroundImage: "linear-gradient(150.11deg, #eef5fb 13.14%, #dceaf6 56.93%, #e2dcf2 86.13%)",
            }}
          >
            <Ss1Component n="06.01" />
            <Is1Component
              title="Find it without the exact words"
              body="Describe it the way you remember it. Ask in English, find what you said in Arabic."
            />
            <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-22px_rgba(23,50,77,0.3)] transition-transform duration-300 ease-out motion-safe:group-hover/search:-translate-y-[3px]">
              <div className="flex w-full items-center gap-[10px] border-b border-alma-hairline px-4 py-[15px]">
                <SearchIcon size={18} strokeWidth={1.6} className="shrink-0 text-alma-muted" aria-hidden />
                <span className="font-body text-base leading-[21px] text-alma-ink">grandma's kabsa recipe</span>
              </div>
              <div className="flex w-full flex-col gap-1 p-2">
                <div className="relative flex w-full items-center gap-3 rounded-xl bg-alma-soft p-2">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-alma-line-accent opacity-0 transition-opacity duration-300 motion-safe:group-hover/search:opacity-100"
                  />
                  <span
                    className="size-11 shrink-0 rounded-[10px]"
                    style={{
                      backgroundImage: "linear-gradient(150.11deg, #e2dcf2 13.139%, #c6bce6 86.131%)",
                    }}
                  />
                  <span className="relative flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="truncate font-body text-[15px] leading-5 text-alma-ink" dir="rtl">
                      وصفة جدتي للكبسة
                    </span>
                    <span className="truncate font-body text-xs leading-4 text-alma-muted">Note · 2 May</span>
                  </span>
                  <span className="relative shrink-0 origin-right rounded-full border border-alma-line-accent bg-white px-2 py-[3px] font-body text-[11px] leading-[14px] text-alma-action transition-transform duration-300 ease-out motion-safe:group-hover/search:scale-[1.07]">
                    Best match
                  </span>
                </div>
                {[
                  {
                    img: fox,
                    t: "The morning she packed",
                    m: "Photo · 28 Aug",
                  },
                  {
                    grad: "linear-gradient(150.11deg, #f6e7da 13.139%, #efd6c2 86.131%)",
                    t: "The name of the tailor in Satwa",
                    m: "Note · Oct 2025",
                  },
                ].map((e) => (
                  <div key={e.t} className="flex w-full items-center gap-3 rounded-xl p-2">
                    {e.img ? (
                      <img
                        src={e.img}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className="size-11 shrink-0 rounded-[10px] object-cover"
                      />
                    ) : (
                      <span
                        className="size-11 shrink-0 rounded-[10px]"
                        style={{
                          backgroundImage: e.grad,
                        }}
                      />
                    )}
                    <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                      <span className="truncate font-body text-[15px] font-medium leading-5 text-alma-ink">{e.t}</span>
                      <span className="truncate font-body text-xs leading-4 text-alma-muted">{e.m}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Ue1Component>
          <Ue1Component
            delay={0.06}
            className={`${os} w-full lg:h-full lg:w-[32.36%]`}
            style={{
              backgroundImage: "linear-gradient(150.11deg, #fbf3ec 13.14%, #f6e7da 86.13%)",
            }}
          >
            <Ss1Component n="06.02" />
            <Is1Component
              title="Hear their voice again"
              body="Voice notes stay playable, with a transcript you can fix when it mishears a name."
            />
            <div className="group/audio flex w-full flex-col gap-3 rounded-2xl bg-white p-[14px] shadow-[0_18px_40px_-22px_rgba(138,90,36,0.3)] transition-transform duration-300 ease-out motion-safe:hover:-translate-y-[3px]">
              <div className="flex w-full items-center gap-[10px]">
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-alma-action transition-transform duration-300 ease-out motion-safe:group-hover/audio:scale-[1.06]">
                  <PlayIcon
                    size={14}
                    strokeWidth={1.6}
                    aria-hidden
                    className="absolute translate-x-px fill-white text-white transition-opacity duration-200 motion-safe:group-hover/audio:opacity-0"
                  />
                  <PauseIcon
                    size={14}
                    strokeWidth={1.6}
                    aria-hidden
                    className="absolute fill-white text-white opacity-0 transition-opacity duration-200 motion-safe:group-hover/audio:opacity-100"
                  />
                </span>
                <span className="relative flex min-w-px flex-1 items-center overflow-hidden" aria-hidden>
                  <span className="flex min-w-px items-center gap-[2px]">
                    <Mw1Component tone="bg-alma-line" />
                  </span>
                  <span className="absolute inset-0 flex items-center gap-[2px] [clip-path:inset(0_62%_0_0)] motion-safe:group-hover/audio:animate-[wave-play_7s_linear_forwards]">
                    <Mw1Component tone="bg-person-amber-ink" />
                  </span>
                </span>
                <span className="shrink-0 font-body text-xs leading-4 text-alma-muted">0:42</span>
              </div>
              <p className="font-body text-sm leading-[21px] text-alma-ink">
                “Call <span className="text-alma-faint line-through">Rhea</span>{" "}
                <span className="text-person-amber-ink">Riya</span> on Tuesday. She said she'd call every week.”
              </p>
            </div>
          </Ue1Component>
        </div>
        <div className="flex w-full flex-col gap-[14px] md:[display:contents] lg:h-[247px] lg:flex lg:flex-row">
          <Ue1Component
            className={`group/words ${os} w-full border border-alma-hairline bg-white lg:h-full lg:w-[32.53%]`}
          >
            <Ss1Component n="06.03" />
            <Is1Component
              title="Your words stay yours"
              body="Alma's summary sits beside your original, never on top of it."
            />
            <div className="flex shrink-0 gap-[2px] self-start rounded-xl bg-alma-sunken p-[3px]">
              <span className="relative rounded-[9px] px-3 py-[7px] font-body text-[13px] leading-[17px] text-alma-ink">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[9px] bg-white transition-opacity duration-300 motion-safe:group-hover/words:opacity-0"
                />
                <span className="relative">Your words</span>
              </span>
              <span className="relative rounded-[9px] px-3 py-[7px] font-body text-[13px] leading-[17px] text-alma-muted transition-colors duration-300 motion-safe:group-hover/words:text-alma-ink">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[9px] bg-white opacity-0 transition-opacity duration-300 motion-safe:group-hover/words:opacity-100"
                />
                <span className="relative">Alma's summary</span>
              </span>
            </div>
            <div className="grid">
              <p className="col-start-1 row-start-1 font-editorial text-lg italic leading-[26px] text-alma-ink transition-opacity duration-300 motion-safe:group-hover/words:opacity-0">
                “Last Sunday before Riya leaves. Everyone ordered the same thing.”
              </p>
              <p className="col-start-1 row-start-1 font-body text-[15px] leading-[23px] text-alma-muted opacity-0 transition-opacity duration-300 motion-safe:group-hover/words:opacity-100">
                A farewell breakfast at Mira's, the Sunday before Riya left for Berlin.
              </p>
            </div>
          </Ue1Component>
          <Ue1Component
            delay={0.06}
            className={`group/fix ${os} w-full border border-alma-hairline bg-white lg:h-full lg:w-[32.53%]`}
          >
            <Ss1Component n="06.04" />
            <Is1Component
              title="Fix it once"
              body="Change a date, a name or a tag. Every future answer uses your fix."
            />
            <div className="flex w-full flex-col gap-2 rounded-[14px] border border-alma-hairline bg-alma-subtle p-3">
              <p className="font-body text-[15px] font-medium leading-5 text-alma-ink">The morning she packed</p>
              <div className="flex items-center gap-[6px]">
                <span className="font-body text-[13px] leading-[17px] text-alma-muted">Photo ·</span>
                <span className="font-body text-[13px] leading-[17px] text-alma-faint line-through transition-opacity duration-300 motion-safe:group-hover/fix:opacity-40">
                  12 Jun
                </span>
                <span className="origin-left rounded-full border border-alma-line-accent bg-alma-soft px-2 py-px font-body text-[13px] leading-[17px] text-alma-action transition-transform duration-300 ease-out motion-safe:group-hover/fix:scale-[1.08]">
                  28 Aug
                </span>
              </div>
            </div>
            <p className="font-body text-[13px] leading-[17px] text-alma-muted">
              Corrected by you · Alma will use 28 Aug from now on
            </p>
          </Ue1Component>
          <Ue1Component
            delay={0.12}
            className={`group/star ${os} w-full border border-alma-hairline bg-white lg:h-full lg:w-[32.53%]`}
          >
            <Ss1Component n="06.05" />
            <Is1Component
              title="Star what matters most"
              body="One core-memory flag. No scores, no streaks, no guilt."
            />
            <span className="flex shrink-0 items-center gap-[10px] self-start rounded-xl border border-alma-line-accent bg-alma-soft py-[10px] pe-[14px] ps-[10px]">
              <StarIcon
                size={22}
                strokeWidth={1.4}
                aria-hidden
                className="fill-alma-core text-alma-core transition-transform duration-300 ease-out motion-safe:group-hover/star:rotate-[18deg] motion-safe:group-hover/star:scale-110"
              />
              <span className="font-body text-[15px] leading-5 text-alma-ink">Core memory</span>
            </span>
            <p className="font-body text-[13px] leading-[17px] text-alma-muted">Her voice, kitchen radio on. 19 Jun.</p>
          </Ue1Component>
        </div>
        <div className="flex w-full flex-col gap-[14px] md:[display:contents] lg:h-[283px] lg:flex lg:flex-row">
          <Ue1Component
            className={`${os} w-full lg:h-full lg:w-[32.53%]`}
            style={{
              backgroundImage: "linear-gradient(150.11deg, #e2dcf2 13.14%, #eef5fb 86.13%)",
            }}
          >
            <Ss1Component n="06.06" />
            <Is1Component
              nowrap
              title="A gentle nudge, only if you want it"
              body="One short message at a time you choose. Skip it, pause it or turn it off."
            />
            <div className="group/nudge flex w-full flex-col gap-3 rounded-2xl bg-white p-[14px] shadow-[0_18px_40px_-22px_rgba(74,74,153,0.3)] transition-transform duration-300 ease-out motion-safe:hover:-translate-y-[3px]">
              <div className="flex w-full items-center justify-between">
                <span className="font-body text-[15px] font-medium leading-5 text-alma-ink">Daily check-in</span>
                <span className="relative block h-[26px] w-[46px] shrink-0 overflow-hidden rounded-full bg-alma-sunken">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full transition-opacity duration-300 motion-safe:group-hover/nudge:opacity-0"
                    style={{
                      backgroundImage: "linear-gradient(90deg, #c8e1f2 0%, #a8d0e8 100%)",
                    }}
                  />
                  <span className="absolute end-[3px] top-[3px] block size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(23,50,77,0.14)] transition-transform duration-300 ease-out motion-safe:group-hover/nudge:-translate-x-5 motion-safe:rtl:group-hover/nudge:translate-x-5" />
                </span>
              </div>
              <div className="flex gap-[6px]">
                {["8:00", "13:00", "21:00"].map((e, t) => (
                  <span
                    key={e}
                    className={`rounded-[10px] border px-3 py-2 font-body text-[13px] leading-[17px] transition-opacity duration-300 ${t === 2 ? "border-[#c6bce6] bg-person-violet font-medium text-person-violet-ink motion-safe:group-hover/nudge:opacity-45" : "border-alma-line text-alma-muted"}`}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <p className="font-body text-[13px] leading-[17px] text-alma-muted">
                Alma will check in at 21:00. One message, nothing more.
              </p>
            </div>
          </Ue1Component>
          <Ue1Component
            delay={0.06}
            className={`${os} w-full lg:h-full lg:w-[66.27%]`}
            style={{
              backgroundImage: "linear-gradient(150.11deg, #fbf3ec 13.14%, #eef5fb 86.13%)",
            }}
          >
            <Ss1Component n="06.07" />
            <Is1Component
              nowrap
              title="Memories that find you"
              body="Turn on revisits and Alma brings back something from this day in another year. One a week, never more."
            />
            <div className="group/open flex w-full items-center gap-[14px] rounded-[18px] bg-white py-[10px] pe-[14px] ps-[10px] shadow-[0_18px_40px_-22px_rgba(138,90,36,0.3)] transition-transform duration-300 ease-out motion-safe:hover:-translate-y-[3px]">
              <img
                src={hill}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="size-16 shrink-0 rounded-xl object-cover transition-transform duration-500 ease-out motion-safe:group-hover/open:scale-[1.06]"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="font-body text-[11px] font-semibold leading-[14px] tracking-[0.08em] text-person-amber-ink">
                  ON THIS DAY · 2019
                </span>
                <span className="truncate font-body text-[15px] font-medium leading-5 text-alma-ink">
                  The view from the hill
                </span>
                <span className="truncate font-body text-xs leading-4 text-alma-muted">Rio de Janeiro · with Mira</span>
              </span>
              <span className="relative shrink-0 overflow-hidden rounded-full border border-alma-line-accent bg-alma-canvas px-3 py-[6px]">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-alma-action opacity-0 transition-opacity duration-300 motion-safe:group-hover/open:opacity-100"
                />
                <span className="relative font-body text-xs leading-4 text-alma-action transition-colors duration-300 motion-safe:group-hover/open:text-white">
                  Open
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block size-[7px] rounded-full bg-[#23b33a]" />
              <span className="font-body text-[13px] leading-[17px] text-alma-muted">
                Sent to you on WhatsApp, Sunday 9:00
              </span>
            </div>
          </Ue1Component>
        </div>
      </div>
    </section>
  );
}
const fB =
  "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7%2010.5H17C18.3807%2010.5%2019.5%2011.6193%2019.5%2013V18C19.5%2019.3807%2018.3807%2020.5%2017%2020.5H7C5.61929%2020.5%204.5%2019.3807%204.5%2018V13C4.5%2011.6193%205.61929%2010.5%207%2010.5Z'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M8%2010.5V7.5C8%206.43913%208.42143%205.42172%209.17157%204.67157C9.92172%203.92143%2010.9391%203.5%2012%203.5C13.0609%203.5%2014.0783%203.92143%2014.8284%204.67157C15.5786%205.42172%2016%206.43913%2016%207.5V10.5'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const pB =
  "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3%2012C3%2012%206.5%205.5%2012%205.5C17.5%205.5%2021%2012%2021%2012C21%2012%2017.5%2018.5%2012%2018.5C6.5%2018.5%203%2012%203%2012Z'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M14.6004%2012C14.6004%2013.4359%2013.4363%2014.6%2012.0004%2014.6C10.5645%2014.6%209.40039%2013.4359%209.40039%2012C9.40039%2010.5641%2010.5645%209.39999%2012.0004%209.39999C13.4363%209.39999%2014.6004%2010.5641%2014.6004%2012Z'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M4%2020L20%204'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const fA =
  "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M20%2014.5V17.5C20%2018.163%2019.7366%2018.7989%2019.2678%2019.2678C18.7989%2019.7366%2018.163%2020%2017.5%2020H6.5C5.83696%2020%205.20107%2019.7366%204.73223%2019.2678C4.26339%2018.7989%204%2018.163%204%2017.5V14.5'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3cpath%20d='M16%2010L12%2014L8%2010M12%2014V4'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const pA =
  "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4%207H6M6%207H9M6%207L7%2020H17L18%207M9%207H15M9%207V4.5H15V7M15%207H18M18%207H20'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23285E85'/%3e%3c/svg%3e";
const mB = [
  {
    icon: fB,
    tint: "bg-alma-soft",
    title: "Private to you",
    body: "Only your account opens your vault. Nobody else can see what is in it.",
  },
  {
    icon: pB,
    tint: "bg-person-violet",
    title: "Never sold",
    body: "Not to advertisers, not to data brokers, not to anyone. Ever.",
  },
  {
    icon: fA,
    tint: "bg-person-blue",
    title: "Leave with everything",
    body: "One tap exports photos, notes and transcripts as a .zip.",
  },
  {
    icon: pA,
    tint: "bg-person-amber",
    title: "Delete means delete",
    body: "Gone from answers right away, fully erased within 30 days.",
  },
];
const gB = [
  {
    t: "Auto-tag people in photos",
    m: "ALMA groups faces it has seen before.",
    on: true,
  },
  {
    t: "Weekly reflection",
    m: "A short note on what you kept, every Sunday.",
    on: true,
  },
  {
    t: "Suggest memories to revisit",
    m: "Surface something from a year ago.",
    on: false,
  },
];
function YB1Component({ on }) {
  return (
    <span
      className={`relative block h-[25px] w-11 shrink-0 rounded-full ${on ? "bg-alma-action" : "bg-alma-line"}`}
      aria-hidden
    >
      <span
        className={`absolute top-[3px] block size-[19px] rounded-full bg-white ${on ? "end-[3px]" : "start-[3px]"}`}
      />
    </span>
  );
}
function VB1Component() {
  return (
    <section
      id="privacy"
      className="flex scroll-mt-24 flex-col gap-10 bg-alma-canvas px-6 md:px-12 py-20 lg:gap-16 lg:px-[136px] lg:py-[140px]"
    >
      <XaComponent
        index="07"
        label="PRIVACY"
        title="Your memories."
        emphasis="Your rules."
        lede="You decide what's kept, what's deleted and what Alma brings back. Here's exactly what that means, without the fine print."
      />
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-stretch gap-4 lg:flex-row">
          <Ue1Component
            className="flex w-full flex-col gap-7 rounded-[32px] border border-alma-hairline p-7 lg:w-[57.88%] lg:p-10"
            style={{
              backgroundImage: "radial-gradient(120% 90% at 17% 75%, #c8e1f2 0%, #eef4f9 100%)",
            }}
          >
            <div className="flex flex-col gap-2">
              <p className="font-body text-xs font-medium leading-4 tracking-[0.14em] text-alma-action">
                YOU HOLD THE SWITCHES
              </p>
              <h3 className="font-body text-[26px] leading-8 tracking-[-0.03em] text-alma-ink lg:text-[30px] lg:leading-[38px]">
                Every setting is yours to flip.
              </h3>
              <p className="max-w-[440px] font-body text-[15px] leading-[23px] text-alma-muted">
                What Alma tags, what it brings back, and whether it keeps anything at all.
              </p>
            </div>
            <div className="flex w-full flex-col gap-[14px] rounded-[18px] border border-[rgba(82,103,121,0.1)] bg-white/95 p-[22px] shadow-[0_3px_12px_0_rgba(41,94,133,0.05)]">
              <p className="font-display text-[15px] font-semibold leading-5 tracking-[0.01em] text-alma-ink">
                Memory preferences
              </p>
              {gB.map((e) => (
                <div key={e.t} className="flex w-full items-center gap-3">
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className="truncate font-body text-[13px] font-medium leading-[17px] tracking-[0.02em] text-[rgba(23,50,77,0.95)]">
                      {e.t}
                    </span>
                    <span className="truncate font-body text-[11.5px] leading-[15px] tracking-[0.02em] text-[rgba(82,103,121,0.5)]">
                      {e.m}
                    </span>
                  </span>
                  <YB1Component on={e.on} />
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col gap-[14px] rounded-[18px] border border-[rgba(82,103,121,0.1)] bg-white/95 p-[22px] shadow-[0_3px_12px_0_rgba(41,94,133,0.05)]">
              <div className="flex flex-col gap-[6px]">
                <p className="font-display text-[15px] font-semibold leading-5 tracking-[0.01em] text-alma-ink">
                  Your data
                </p>
                <p className="font-body text-xs leading-[18px] tracking-[0.01em] text-[rgba(82,103,121,0.55)]">
                  Export or remove everything ALMA holds for you.
                </p>
              </div>
              <div className="flex w-full items-center gap-[10px]">
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="font-body text-[13px] font-medium leading-[17px] tracking-[0.02em] text-[rgba(23,50,77,0.95)]">
                    Export everything
                  </span>
                  <span className="font-body text-[11.5px] leading-[15px] tracking-[0.02em] text-[rgba(82,103,121,0.5)]">
                    Photos, notes, transcripts and tags as a .zip
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 rounded-full border border-[rgba(82,103,121,0.12)] bg-alma-sunken py-[10px] pe-4 ps-[14px]">
                  <img src={fA} alt="" aria-hidden width={15} height={15} className="size-[15px]" />
                  <span className="font-body text-[12.5px] font-medium leading-4 tracking-[0.02em] text-[rgba(82,103,121,0.85)]">
                    Export
                  </span>
                </span>
              </div>
              <div className="h-px w-full bg-[rgba(82,103,121,0.09)]" />
              <div className="flex w-full items-center gap-[10px]">
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="font-body text-[13px] font-medium leading-[17px] tracking-[0.02em] text-[#b3261e]">
                    Delete account
                  </span>
                  <span className="font-body text-[11.5px] leading-[15px] tracking-[0.02em] text-[rgba(82,103,121,0.5)]">
                    Permanent. Everything is erased within 30 days.
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 rounded-full border border-[rgba(179,38,30,0.25)] bg-[#fdf1f0] py-[10px] pe-4 ps-[14px]">
                  <img src={pA} alt="" aria-hidden width={15} height={15} className="size-[15px]" />
                  <span className="font-body text-[12.5px] font-medium leading-4 tracking-[0.02em] text-[#b3261e]">
                    Delete
                  </span>
                </span>
              </div>
            </div>
          </Ue1Component>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[40.75%]">
            {mB.map((e, t) => (
              <Ue1Component
                key={e.title}
                delay={0.06 * t}
                className="flex h-full flex-col justify-between gap-7 rounded-[28px] border border-alma-hairline bg-white p-7"
              >
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-[15px] ${e.tint}`}>
                  <img src={e.icon} alt="" aria-hidden width={24} height={24} className="size-6" />
                </span>
                <span className="flex w-full flex-col gap-2">
                  <span className="font-body text-lg font-medium leading-6 tracking-[-0.015em] text-alma-ink">
                    {e.title}
                  </span>
                  <span className="font-body text-[15px] leading-[23px] text-alma-muted">{e.body}</span>
                </span>
              </Ue1Component>
            ))}
          </div>
        </div>
        <Ue1Component className="flex w-full flex-col gap-6 rounded-3xl bg-alma-ink px-7 py-6 lg:flex-row lg:items-center lg:gap-10 lg:px-9">
          <p className="shrink-0 font-body text-xs font-medium leading-4 tracking-[0.14em] text-alma-panel-label">
            WHAT WE
            <br className="hidden lg:inline" /> WON'T CLAIM
          </p>
          {[
            {
              claim: "End-to-end encrypted",
              why: "Alma reads your messages to answer them.",
            },
            {
              claim: "Your AI therapist",
              why: "It won't diagnose you or pretend to miss you.",
            },
            {
              claim: "Finished",
              why: "It's early access. Tell us what breaks.",
            },
          ].map((e) => (
            <div
              key={e.claim}
              className="flex min-w-px flex-1 flex-col gap-1 border-s border-[rgba(205,221,234,0.18)] ps-[18px]"
            >
              <p className="font-body text-base font-medium leading-5 text-white line-through">{e.claim}</p>
              <p className="font-body text-sm leading-[18px] text-alma-panel-text">{e.why}</p>
            </div>
          ))}
        </Ue1Component>
      </div>
    </section>
  );
}
const xB =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%20clip-path='url(%23clip0_0_20)'%3e%3cpath%20id='Vector'%20d='M9%2018C13.9706%2018%2018%2013.9706%2018%209C18%204.02944%2013.9706%200%209%200C4.02944%200%200%204.02944%200%209C0%2013.9706%204.02944%2018%209%2018Z'%20fill='%23F6E7DA'%20fill-opacity='0.16'/%3e%3cpath%20id='Vector_2'%20d='M5.5%209.3L7.8%2011.6L12.5%206.7'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23F6E7DA'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_20'%3e%3crect%20width='18'%20height='18'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const wB = [
  <>
    Alma on WhatsApp, in English and <span dir="rtl">العربية</span>
  </>,
  "Your vault on web and phone: Gallery, Memories, Journey, Calendar",
  "Voice notes kept with a transcript you can fix",
  "Optional daily check-in and weekly reflection",
  "Export or delete everything, any time",
];
const bB = [
  {
    t: "If pricing ever changes",
    b: "You'll hear from us well before, with time to export everything you've kept.",
  },
  {
    t: "Your memories stay yours",
    b: "Nothing is sold, and nothing is locked in. Leaving takes one tap in Settings.",
  },
  {
    t: "Built with early users",
    b: "Tell Alma what's missing. The next features come from those messages.",
  },
];
function KB1Component() {
  const e = useNavigate();
  return (
    <section
      id="the-price"
      className="flex scroll-mt-24 flex-col gap-10 bg-alma-canvas px-6 md:px-12 pb-10 pt-20 lg:gap-16 lg:px-[136px] lg:pt-[140px]"
    >
      <XaComponent
        index="08"
        label="THE PRICE"
        title="Free while we're"
        emphasis="in early access."
        lede="No card, no trial clock. Keep what matters and tell us what to build next."
      />
      <div className="flex w-full flex-col items-stretch gap-4 lg:flex-row">
        <Ue1Component
          className="flex w-full flex-col gap-7 rounded-[32px] px-7 py-10 lg:w-[57.88%] lg:px-12 lg:py-11"
          style={{
            backgroundImage: "radial-gradient(130% 100% at 15% 86%, #4a4f6e 0%, #31415e 50%, #17324d 100%)",
          }}
        >
          <div className="flex w-full flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-end">
            <span className="shrink-0 rounded-full border border-[rgba(246,231,218,0.35)] px-3 py-[6px] font-mono text-[11px] leading-[14px] tracking-[0.12em] text-[#f6e7da]">
              EARLY ACCESS
            </span>
            <span className="flex flex-col items-start gap-2 sm:items-end">
              <span className="font-body text-[72px] leading-[66px] tracking-[-0.05em] text-white lg:text-[96px] lg:leading-[86px]">
                Free
              </span>
              <span className="font-body text-sm leading-[18px] text-alma-panel-label">
                for now, with everything included
              </span>
            </span>
          </div>
          <ul className="flex w-full flex-col gap-3 border-t border-[rgba(205,221,234,0.18)] pt-[22px]">
            {wB.map((t, n) => (
              <li key={n} className="flex w-full items-start gap-[10px]">
                <img src={xB} alt="" aria-hidden width={18} height={18} className="mt-[3px] size-[18px] shrink-0" />
                <span className="min-w-px flex-1 font-body text-base leading-[22px] text-[#e8f0f7]">{t}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => e("/auth")}
            className="relative inline-flex h-[45px] shrink-0 items-center justify-center self-start rounded-xl bg-white px-3 font-body text-base leading-[21px] tracking-[0.02em] text-alma-ink transition-colors hover:bg-alma-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-alma-ink"
          >
            Start free
          </button>
        </Ue1Component>
        <div className="flex w-full flex-col gap-4 lg:w-[40.75%]">
          {bB.map((t, n) => (
            <Ue1Component
              key={t.t}
              delay={0.06 * n}
              className="flex flex-1 flex-col gap-[6px] rounded-3xl border border-alma-hairline bg-white px-[26px] py-6"
            >
              <p className="font-body text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-alma-ink">{t.t}</p>
              <p className="font-body text-[15px] leading-[23px] text-alma-muted">{t.b}</p>
            </Ue1Component>
          ))}
        </div>
      </div>
    </section>
  );
}
const gw = [
  {
    q: "Do I need to install anything?",
    a: "No. You talk to Alma in WhatsApp, and your vault opens in any browser. Linking WhatsApp takes about 30 seconds, and you can add the vault to your home screen if you'd like it to feel like an app.",
  },
  {
    q: "Is it free?",
    a: "Yes, while Alma is in early access. There's no payment in the product, and if that ever changes you'll hear from us well before, with time to export everything.",
  },
  {
    q: "Which languages does Alma understand?",
    a: "English and Arabic at launch, including both mixed in a single message.",
  },
  {
    q: "What happens when I delete a memory?",
    a: "It disappears from search and from Alma's answers straight away. Deleting your account erases everything within 30 days.",
  },
  {
    q: "Can Alma make things up?",
    a: "It answers only from what you've sent and shows you the source so you can check.",
  },
  {
    q: "Does it work with my calendar?",
    a: "If you connect Google Calendar, Alma can add plans you mention in chat.",
  },
  {
    q: "Can I leave?",
    a: "Any time, with everything. Export first, then delete your account in Settings.",
  },
];
const yw = "pilot@meetalma.ai";
function SBComponent() {
  const [e, setE] = React.useState(0);
  const [n, setN] = React.useState(false);
  const [s, setS] = React.useState();
  const oRef = React.useRef(null);
  const aRef = React.useRef([]);
  const lRef = React.useRef([]);
  const c = React.useCallback(() => {
    const h = lRef.current.filter(Boolean);
    const f = aRef.current.filter(Boolean);
    if (h.length !== gw.length) {
      return;
    }
    const p = h.reduce((acc, item, index) => {
      const g = f[index];
      const w = g ? g.getBoundingClientRect().height : 0;
      return acc + item.getBoundingClientRect().height - w;
    }, 0);
    const y = f.reduce((acc, item) => Math.max(acc, item.scrollHeight), 0);
    setS(Math.ceil(p + y));
  }, []);
  React.useLayoutEffect(() => {
    c();
  }, [c]);
  React.useEffect(() => {
    var f;
    if ((f = document.fonts) != null && f.ready) {
      document.fonts.ready.then(c);
    }
    const h = new ResizeObserver(c);
    if (oRef.current) {
      h.observe(oRef.current);
    }
    return () => h.disconnect();
  }, [c]);
  async function d() {
    try {
      await navigator.clipboard.writeText(yw);
      setN(true);
      window.setTimeout(() => setN(false), 2000);
    } catch (error) {
      console.error("Clipboard write failed", error);
    }
  }
  return (
    <section
      id="questions"
      className="flex scroll-mt-24 flex-col bg-alma-canvas px-6 md:px-12 pb-16 pt-14 lg:px-[136px] lg:pb-[140px] lg:pt-[100px]"
    >
      <div className="flex w-full flex-col gap-7 lg:flex-row lg:gap-[120px]">
        <Ue1Component className="flex w-full flex-col gap-4 border-t border-alma-line pt-[22px] lg:w-[380px] lg:shrink-0">
          <p className="font-mono text-xs font-medium leading-4 tracking-[0.1em]">
            <span className="text-alma-faint">[09]</span>
            <span className="text-alma-action"> QUESTIONS</span>
          </p>
          <h2 className="font-body text-[38px] leading-[42px] tracking-[-0.04em] text-alma-ink sm:text-[52px] sm:leading-[56px] lg:text-[70px] lg:leading-[70px]">
            Questions, <span className="font-editorial italic text-alma-action">answered.</span>
          </h2>
          <p className="font-body text-[17px] leading-[26px] text-alma-muted lg:text-[19px] lg:leading-7">
            What people usually ask before they send their first memory.
          </p>
        </Ue1Component>
        <div className="flex min-w-px flex-1 flex-col">
          <div
            ref={oRef}
            className="flex flex-col border-t border-alma-line"
            style={
              s
                ? {
                    minHeight: s,
                  }
                : undefined
            }
          >
            {gw.map((h, f) => {
              const p = e === f;
              return (
                <div
                  key={h.q}
                  ref={(y) => (lRef.current[f] = y)}
                  className="flex w-full flex-col border-b border-alma-line"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setE(p ? -1 : f)}
                      aria-expanded={p}
                      aria-controls={`faq-a-${f}`}
                      className="flex w-full items-center justify-between gap-6 py-[22px] text-start"
                    >
                      <span className="font-body text-[17px] leading-6 tracking-[-0.015em] text-alma-ink lg:text-[19px]">
                        {h.q}
                      </span>
                      {p ? (
                        <MinusIcon size={14} strokeWidth={1.6} className="shrink-0 text-alma-muted" aria-hidden />
                      ) : (
                        <PlusIcon size={14} strokeWidth={1.6} className="shrink-0 text-alma-muted" aria-hidden />
                      )}
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${f}`}
                    role="region"
                    className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      gridTemplateRows: p ? "1fr" : "0fr",
                    }}
                  >
                    <div ref={(y) => (aRef.current[f] = y)} className="overflow-hidden" aria-hidden={!p}>
                      <p className="pb-[22px] font-body text-base leading-[25px] text-alma-muted">{h.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-6">
            <div className="flex w-full flex-col items-start gap-[14px] rounded-[20px] border border-alma-line-accent bg-alma-soft px-[18px] py-4 sm:flex-row sm:items-center">
              <span
                className="size-7 shrink-0 rounded-full"
                style={{
                  backgroundImage: "linear-gradient(150.11deg, #c8e1f2 13.14%, #a8d0e8 86.13%)",
                }}
              />
              <span className="flex min-w-px flex-1 flex-col gap-[2px]">
                <span className="font-body text-[15px] font-medium leading-5 text-alma-ink">
                  Still wondering about something?
                </span>
                <span className="font-body text-[15px] leading-5 text-alma-muted">
                  Write to {yw}. A real person replies, usually within a day.
                </span>
              </span>
              <button
                type="button"
                onClick={d}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-alma-line bg-alma-sunken py-[13px] pe-5 ps-[18px] font-body text-sm font-medium leading-5 tracking-[0.02em] text-alma-ink transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-action"
              >
                {n ? "Copied" : "Copy email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function MAComponent({ id }) {
  return (
    <defs>
      <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}
function EBComponent({ className }) {
  return (
    <svg
      viewBox="0 0 210 225"
      fill="none"
      aria-hidden
      focusable="false"
      className={className}
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <MAComponent id="chalk-a" />
      <g filter="url(#chalk-a)">
        <path d="M44 50c0-13 11-23 23-22 13 1 22 11 21 24-1 12-11 21-23 20-12-1-21-10-21-22" />
        <path d="M58 46.5c.2 2.4.1 3.6 0 4.2M78 45.6c.3 2.2.4 3.5.2 4.4" />
        <path d="M57 60c3.6 4.2 11.6 4.6 16-.4" />
        <path d="M66 73c-1 20-1.5 42-2 65" />
        <path d="M36 101c9-5 18-9 29-11" />
        <path d="M66 90c10 3 19 9 27 16" />
        <path d="M64 138c-5 16-11 31-17 45" />
        <path d="M64 138c4 15 8 29 13 42" />
        <path d="M119 101c0-9 8-16 16-15 9 0 16 8 15 17-1 8-8 14-16 14-8-1-15-8-15-16" />
        <path d="M129 99c.2 1.6.2 2.5.1 3M141 98.6c.2 1.5.3 2.4.2 3.1" />
        <path d="M128 110c2.7 3 8 3.2 11.4-.3" />
        <path d="M134 117c-.6 14-1 28-1.4 41" />
        <path d="M134 128c-13-3-26-7-41-22" />
        <path d="M134 128c8 2 15 6 21 12" />
        <path d="M133 158c-3 11-7 21-11 30" />
        <path d="M133 158c3 10 6 20 9 29" />
        <path d="M20 196c26 4 52-3 78 1 27 4 53 2 80-3" strokeOpacity={0.75} />
      </g>
    </svg>
  );
}
function ABComponent({ className }) {
  return (
    <svg
      viewBox="0 0 190 175"
      fill="none"
      aria-hidden
      focusable="false"
      className={className}
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <MAComponent id="chalk-b" />
      <g filter="url(#chalk-b)">
        <path d="M52 72c-2-20 15-37 36-37s38 15 37 35c-1 19-17 33-37 33S54 90 52 72" />
        <path d="M60 46 55 18l25 15" />
        <path d="M121 45l8-27-23 17" />
        <path d="M74 64c.3 3 .3 4.6.2 5.6M109 63c.3 2.9.4 4.5.3 5.5" />
        <path d="M86 81h12l-6 7z" />
        <path d="M78 84 44 78M78 90 46 92M110 83l33-7M110 89l32 3" strokeOpacity={0.8} />
        <path d="M66 100c-6 18-5 36 4 46 14 15 40 14 52-2 7-10 7-27 2-44" />
        <path d="M124 142c16 6 27 0 28-11 1-9-7-15-14-11-6 3-6 12 2 14" />
        <path d="M80 148v10M96 150v9" strokeOpacity={0.8} />
      </g>
    </svg>
  );
}
function CBComponent() {
  const e = useNavigate();
  return (
    <section
      className="relative isolate overflow-hidden px-6 py-24 lg:py-[146px]"
      style={{
        backgroundImage: "linear-gradient(180deg, #5b7593 0%, #2f4f70 45%, #17324d 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(700px 320px at 14% 0%, rgba(201,188,214,0.30), transparent 70%), radial-gradient(760px 300px at 82% 2%, rgba(233,195,180,0.26), transparent 72%), radial-gradient(900px 260px at 52% 38%, rgba(169,182,204,0.28), transparent 70%)",
        }}
      />
      <EBComponent className="pointer-events-none absolute bottom-[22%] start-[4%] hidden w-[200px] -rotate-6 select-none text-white/[0.14] lg:block xl:w-[232px]" />
      <Ue1Component className="relative mx-auto flex w-full max-w-[1168px] flex-col items-center gap-5">
        <p className="font-body text-xs font-medium leading-4 tracking-[0.14em] text-alma-soft">YOUR FIRST MEMORY</p>
        <h2 className="text-center font-body text-[44px] leading-[44px] tracking-[-0.05em] text-white sm:text-[64px] sm:leading-[62px] lg:text-[92px] lg:leading-[88px]">
          Send your first
          <br />
          memory <span className="font-editorial italic text-[#f6e7da]">tonight.</span>
        </h2>
        <p className="max-w-[520px] text-center font-body text-[17px] leading-[26px] text-[#e3edf6] lg:text-xl lg:leading-[30px]">
          Thirty seconds to set up. A year from now, you'll ask for it and Alma will still have it, in your words.
        </p>
        <button
          type="button"
          onClick={() => e("/auth")}
          aria-label="Start free — send your first memory"
          className="flex w-full max-w-[620px] items-center gap-3 rounded-[18px] md:max-w-[560px] lg:max-w-[620px] bg-white/95 py-2 pe-2 ps-5 text-start shadow-[0_30px_60px_-24px_rgba(0,0,0,0.45)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span className="min-w-px flex-1 font-body text-[17px] leading-[22px] text-alma-faint">
            Tell ALMA about your day…
          </span>
          <PlusIcon size={20} strokeWidth={1.5} className="shrink-0 text-alma-muted" aria-hidden />
          <MicIcon size={20} strokeWidth={1.5} className="shrink-0 text-alma-muted" aria-hidden />
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-alma-action">
            <ArrowUp size={16} strokeWidth={2} className="text-white" aria-hidden />
          </span>
        </button>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-[22px]">
          <button
            type="button"
            onClick={() => e("/auth")}
            className="flex items-center justify-center gap-2 rounded-full border border-alma-line bg-alma-sunken py-[13px] pe-5 ps-[18px] font-body text-sm font-medium leading-5 tracking-[0.02em] text-alma-ink transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowRight size={18} strokeWidth={1.6} className="rtl:-scale-x-100" aria-hidden />
            Start free
          </button>
          <a
            href="#how-it-works"
            className="font-body text-base leading-[21px] text-[#e3edf6] underline underline-offset-2"
          >
            See how it works
          </a>
        </div>
        <p className="text-center font-body text-[13px] leading-[18px] text-[#c9d8e6]">
          •  Free during early access     •  English and <span dir="rtl">العربية</span>     •  Export or leave any time
        </p>
      </Ue1Component>
    </section>
  );
}
const TB = ["how-it-works", "the-app", "the-vault"];
function BComponent() {
  const e = (t) => Qu.find((n) => n.id === t);
  return (
    <footer className="relative isolate flex flex-col gap-10 overflow-hidden bg-alma-ink px-6 pb-8 pt-16 lg:px-[136px] lg:pt-[72px]">
      <div className="flex w-full flex-col gap-10 sm:flex-row sm:flex-wrap">
        <div className="flex min-w-px flex-1 flex-col gap-3 sm:basis-full lg:basis-0">
          <p
            className="font-brand text-[17px] font-bold leading-[21px] tracking-[0.1em] text-white"
            style={{
              fontVariationSettings: '"SOFT" 0, "WONK" 1',
            }}
          >
            ALMA
          </p>
          <p className="max-w-[280px] font-body text-sm leading-[21px] text-alma-panel-text">
            Say it once on WhatsApp. Find it years later in your vault.
          </p>
          <p className="font-mono text-[11px] leading-[14px] tracking-[0.08em] text-alma-panel-label">
            Made by people. Kept by Alma.
          </p>
        </div>
        <nav className="flex w-[180px] flex-col gap-3" aria-label="Product">
          <p className="font-body text-[11px] font-medium leading-[14px] tracking-[0.14em] text-alma-panel-label">
            PRODUCT
          </p>
          {TB.map((t) => (
            <a key={t} href={`#${t}`} className="font-body text-sm leading-[18px] text-white hover:underline">
              {e(t)?.label}
            </a>
          ))}
          <a href="#the-details" className="font-body text-sm leading-[18px] text-white hover:underline">
            The details
          </a>
        </nav>
        <nav className="flex w-[180px] flex-col gap-3" aria-label="Get started">
          <p className="font-body text-[11px] font-medium leading-[14px] tracking-[0.14em] text-alma-panel-label">
            GET STARTED
          </p>
          <Link to="/today" className="font-body text-sm leading-[18px] text-white hover:underline">
            Open the app ↗
          </Link>
          <a href="#privacy" className="font-body text-sm leading-[18px] text-white hover:underline">
            Privacy
          </a>
          <a href="#questions" className="font-body text-sm leading-[18px] text-white hover:underline">
            Questions
          </a>
        </nav>
        <div className="flex w-[180px] flex-col gap-3">
          <p className="font-body text-[11px] font-medium leading-[14px] tracking-[0.14em] text-alma-panel-label">
            CONTACT
          </p>
          <a href="mailto:pilot@meetalma.ai" className="font-body text-sm leading-[18px] text-white hover:underline">
            pilot@meetalma.ai
          </a>
        </div>
      </div>
      <ABComponent className="pointer-events-none absolute bottom-[13%] end-[3%] w-[118px] rotate-[7deg] select-none text-white/[0.09] sm:w-[140px] lg:w-[164px]" />
      <p
        aria-hidden
        className="relative select-none text-center font-body font-semibold tracking-[-0.02em] text-white/[0.08]"
        style={{
          fontSize: "clamp(96px, 20.8vw, 300px)",
          lineHeight: 0.87,
        }}
      >
        ALMA
      </p>
      <div className="flex w-full flex-col gap-2 border-t border-[rgba(205,221,234,0.15)] pt-5 font-body text-xs leading-4 text-alma-panel-text sm:flex-row sm:justify-between">
        <p>© 2026 ALMA AI</p>
        <p>Early access · UAE</p>
      </div>
    </footer>
  );
}
export default function Index() {
  return (
    <SmoothScroll>
      <main className="min-h-dvh bg-alma-canvas font-body text-alma-ink antialiased">
        <_9 />
        <O9Component />
        <M9Component />
        <U9Component />
        <Q9Component />
        <TB1Component />
        <SB1Component />
        <AB1Component />
        <HB1Component />
        <VB1Component />
        <KB1Component />
        <SBComponent />
        <CBComponent />
        <BComponent />
      </main>
      <PhoneNudgeDialog />
    </SmoothScroll>
  );
}
