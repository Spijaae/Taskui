import Lenis from "lenis";
import React from "react";

import { isFileProtocol } from "@/lib/appUrl";

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function hasCoarsePointer() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(pointer: coarse)").matches;
}
export default function SmoothScroll({ children }) {
  const tRef = React.useRef(null);
  React.useEffect(() => {
    if (prefersReducedMotion() || hasCoarsePointer()) {
      if (!isFileProtocol) {
        return;
      }
      // With hash routing an in-page "#section" link would change the route,
      // so scroll to the section ourselves instead.
      const jump = (s) => {
        const link = s.target?.closest?.("a[href^='#']");
        const target = link && link.getAttribute("href").length > 1 && document.querySelector(link.getAttribute("href"));
        if (target) {
          s.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      document.addEventListener("click", jump);
      return () => document.removeEventListener("click", jump);
    }
    const n = new Lenis({
      duration: 0.62,
      easing: (s) => Math.min(1, 1.001 - 2 ** (-10 * s)),
      wheelMultiplier: 1.15,
      touchMultiplier: 1.6,
      autoRaf: true,
    });
    tRef.current = n;
    const r = (s) => {
      if (s.defaultPrevented || s.button !== 0 || s.metaKey || s.ctrlKey || s.shiftKey || s.altKey) {
        return;
      }
      const i = s.target?.closest?.("a[href^='#']");
      if (!i) {
        return;
      }
      const o = i.getAttribute("href");
      if (!o || o === "#") {
        return;
      }
      const a = document.querySelector(o);
      if (a) {
        s.preventDefault();
        n.scrollTo(a, {
          offset: -96,
        });
        if (!isFileProtocol) {
          window.history.replaceState(null, "", o);
        }
      }
    };
    document.addEventListener("click", r);
    return () => {
      document.removeEventListener("click", r);
      n.destroy();
      tRef.current = null;
    };
  }, []);
  return <>{children}</>;
}
