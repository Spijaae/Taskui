import React from "react";

const MobileNavContext = React.createContext(null);
export function useMobileNav() {
  return (
    React.useContext(MobileNavContext) ?? {
      open: () => {},
      close: () => {},
      isOpen: false,
    }
  );
}
export function MobileNavProvider({ children }) {
  const [t, setT] = React.useState(false);
  const r = React.useCallback(() => setT(true), []);
  const close = React.useCallback(() => setT(false), []);
  const i = React.useMemo(
    () => ({
      open: r,
      close,
      isOpen: t,
    }),
    [r, close, t],
  );
  return <MobileNavContext.Provider value={i}>{children}</MobileNavContext.Provider>;
}
