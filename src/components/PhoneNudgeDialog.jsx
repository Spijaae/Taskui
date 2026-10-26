import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

function nudgeDismissedKey(e) {
  return `alma:phone-nudge-dismissed:${e}`;
}
export default function PhoneNudgeDialog() {
  const { t: t_1 } = useI18n();
  const [t, setT] = React.useState(false);
  const [r, setR] = React.useState(null);
  const i = useNavigate();
  React.useEffect(() => {
    let l = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (
        !user ||
        l ||
        (setR(user.id),
        typeof window !== "undefined" && window.localStorage.getItem(nudgeDismissedKey(user.id)) === "1")
      ) {
        return;
      }
      const { data } = await supabase.from("profiles").select("phone").eq("user_id", user.id).maybeSingle();
      if (l) {
        return;
      }
      const h = data?.phone;
      if (!h || h.trim() === "") {
        setT(true);
      }
    })();
    return () => {
      l = true;
    };
  }, []);
  const o = () => {
    if (r && typeof window !== "undefined") {
      window.localStorage.setItem(nudgeDismissedKey(r), "1");
    }
    setT(false);
  };
  const a = () => {
    setT(false);
    i("/settings");
  };
  return (
    <Dialog
      open={t}
      onOpenChange={(l) => {
        if (!l) {
          o();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t_1("account.finishSetup")}</DialogTitle>
          <DialogDescription>
            To use ALMA AI effectively — WhatsApp agent, daily check-ins, OTP sign-in — we need your phone number. Set
            it from the Settings page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={o}>
            {t_1("action.later")}
          </Button>
          <Button onClick={a}>Go to Settings →</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
