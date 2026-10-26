import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTimezoneSync, useNeedsSetup } from "@/lib/profile";
import { returnToFromLocation, rememberReturnTo } from "@/lib/returnTo";

const ProtectedRoute = ({ children }) => {
  const [t, setT] = React.useState(null);
  const [r, setR] = React.useState(true);
  const i = useLocation();
  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((d, h) => {
      setT(h);
      setR(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setT(session);
      setR(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  useTimezoneSync(t?.user?.id ?? null);
  const o = useNeedsSetup(t?.user?.id ?? null, i.pathname === "/setup");
  if (r) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (t && o === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alma-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-alma-action" />
      </div>
    );
  }
  if (t && o && i.pathname !== "/setup") {
    return <Navigate to="/setup" replace />;
  }
  if (!t) {
    const from = returnToFromLocation(i);
    rememberReturnTo(from);
    return (
      <Navigate
        to="/auth"
        state={{
          from,
        }}
        replace
      />
    );
  }
  return <>{children}</>;
};
export default ProtectedRoute;
