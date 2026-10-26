import { LoaderCircle } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AuthAside, AlmaHomeLink, PrivacyNote } from "@/components/auth/AuthArt";
import { MobileSkyGradient, MobileOrbit } from "@/components/auth/MobileOrbit";
import OtpInput from "@/components/auth/OtpInput";
import { COUNTRIES, PhoneInput } from "@/components/auth/PhoneInput";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeReturnTo, consumeReturnTo, rememberReturnTo } from "@/lib/returnTo";

const iconArrow =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/arrow'%3e%3cpath%20id='Vector'%20d='M3.54167%208.5H13.4583M9.20833%2012.75L13.4583%208.5L9.20833%204.25'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconGoogle =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/google'%20clip-path='url(%23clip0_0_4)'%3e%3cpath%20id='Vector'%20d='M17.25%209.225C17.25%208.625%2017.175%208.025%2017.1%207.5H9V10.875H13.65C13.5559%2011.4068%2013.3544%2011.9138%2013.0578%2012.3651C12.7612%2012.8164%2012.3758%2013.2026%2011.925%2013.5V15.675H14.7C16.35%2014.175%2017.25%2011.925%2017.25%209.225Z'%20fill='%234285F4'/%3e%3cpath%20id='Vector_2'%20d='M9%2018C11.325%2018%2013.275%2017.25%2014.7%2015.9L11.925%2013.725C11.175%2014.25%2010.2%2014.55%209%2014.55C6.75%2014.55%204.8%2013.05%204.125%2010.95H1.275V13.2C2.02038%2014.614%203.1289%2015.804%204.48658%2016.6476C5.84426%2017.4912%207.40212%2017.958%209%2018Z'%20fill='%2334A853'/%3e%3cpath%20id='Vector_3'%20d='M4.125%2010.95C3.74776%209.83094%203.74776%208.61906%204.125%207.5V5.25H1.275C0.666215%206.48665%200.349613%207.84662%200.349613%209.225C0.349613%2010.6034%200.666215%2011.9633%201.275%2013.2L4.125%2010.95Z'%20fill='%23FBBC05'/%3e%3cpath%20id='Vector_4'%20d='M9%203.6C10.275%203.6%2011.4%204.05%2012.3%204.875L14.775%202.4C13.214%200.91186%2011.1559%200.0565544%209%200C7.43193%200.012089%205.89422%200.433674%204.53924%201.22299C3.18425%202.0123%202.05901%203.14194%201.275%204.5L4.125%206.75C4.8%205.025%206.75%203.6%209%203.6Z'%20fill='%23EA4335'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_4'%3e%3crect%20width='18'%20height='18'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const PHONE_PATTERN = /^\+?[1-9]\d{9,14}$/;
function errorMessage(e, t) {
  if (e instanceof Error && e.message) {
    return e.message;
  }
  return t;
}
function PrimaryButton({ children, loading, withArrow, ...rest }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      data-busy={loading ? "true" : "false"}
      className="flex h-[54px] w-full items-center justify-center gap-[9px] rounded-[14px] bg-gradient-to-r from-alma-accent-from to-alma-accent-to font-body text-[15px] font-medium tracking-[0.3px] text-white shadow-[0px_6px_16px_0px_rgba(40,94,133,0.18)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring disabled:cursor-not-allowed data-[busy=false]:disabled:opacity-60"
    >
      {loading ? <LoaderCircle className="h-[17px] w-[17px] animate-spin" /> : null}
      {children}
      {withArrow && !loading ? (
        <img src={iconArrow} alt="" className="rtl:-scale-x-100 brightness-0 invert h-[17px] w-[17px]" />
      ) : null}
    </button>
  );
}
function OutlineButton({ children, ...rest }) {
  return (
    <button
      {...rest}
      className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[14px] border border-[rgba(23,50,77,0.16)] bg-white font-body text-[14.5px] font-medium tracking-[0.29px] text-[rgba(23,50,77,0.88)] transition-colors hover:bg-alma-field focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
function TextField({ label: label_1, id, ...rest }) {
  return (
    <div className="flex w-full flex-col gap-[9px]">
      <label
        htmlFor={id}
        className="font-body text-[10px] font-medium uppercase tracking-[1px] text-[rgba(23,50,77,0.45)]"
      >
        {label_1}
      </label>
      <input
        id={id}
        {...rest}
        className="h-[54px] w-full rounded-[14px] border border-[rgba(23,50,77,0.14)] bg-alma-field px-4 font-body text-[15px] tracking-[0.3px] text-[rgba(23,50,77,0.92)] outline-none transition-colors placeholder:text-[rgba(23,50,77,0.32)] focus:border-alma-accent-deep disabled:opacity-60"
      />
    </div>
  );
}
export default function Auth() {
  const [e, setE] = React.useState("phone");
  const [n, setN] = React.useState(COUNTRIES[0]);
  const [s, setS] = React.useState("");
  const [o, setO] = React.useState("");
  const [l, setL] = React.useState("");
  const [d, setD] = React.useState("");
  const [f, setF] = React.useState("");
  const [y, setY] = React.useState(false);
  const b = useNavigate();
  const x = useLocation();
  const { t } = useI18n();
  const w = sanitizeReturnTo(x.state?.from ?? null);
  const phone = `${n.code}${s.replace(/\D/g, "")}`;
  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((R, z) => {
      if (R === "SIGNED_IN" && z) {
        b(w ?? consumeReturnTo() ?? "/today", {
          replace: true,
        });
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        b(w ?? consumeReturnTo() ?? "/today", {
          replace: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [b, w]);
  const S = async (I) => {
    I.preventDefault();
    if (!s.trim()) {
      toast.error(t("auth.err.noPhone"));
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      toast.error(
        t("auth.err.badPhone", {
          country: n.name,
        }),
      );
      return;
    }
    setY(true);
    try {
      const { data, error } = await supabase.functions.invoke("wa-otp-send", {
        body: {
          phone,
        },
      });
      if (error) {
        const D = data?.error ?? error.message ?? "Failed to send OTP";
        throw new Error(D);
      }
      toast.success(t("auth.ok.codeSent"));
      setE("otp");
    } catch (error) {
      console.error("Phone sign in error:", error);
      toast.error(errorMessage(error, t("auth.err.otpSend")));
    } finally {
      setY(false);
    }
  };
  const A = async (I) => {
    I.preventDefault();
    if (o.length !== 6) {
      toast.error(t("auth.err.noCode"));
      return;
    }
    setY(true);
    try {
      const { data, error } = await supabase.functions.invoke("wa-otp-verify", {
        body: {
          phone,
          code: o,
        },
      });
      if (error) {
        const K = data?.error ?? error.message ?? "Invalid OTP";
        throw new Error(K);
      }
      const token_hash = data?.hashed_token;
      if (!token_hash) {
        throw new Error("Invalid server response");
      }
      const { error: error_1 } = await supabase.auth.verifyOtp({
        token_hash,
        type: "email",
      });
      if (error_1) {
        throw error_1;
      }
      toast.success(t("auth.ok.welcome"));
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(errorMessage(error, t("auth.err.otpInvalid")));
    } finally {
      setY(false);
    }
  };
  const C = async () => {
    setY(true);
    try {
      rememberReturnTo(w);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error(errorMessage(error, t("auth.err.googleFailed")));
      setY(false);
    }
  };
  const E = async (I) => {
    I.preventDefault();
    if (!l || !d || !s || !f) {
      toast.error(t("auth.err.allFields"));
      return;
    }
    if (f.length < 6) {
      toast.error(t("auth.err.shortPassword"));
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      toast.error(
        t("auth.err.badPhone", {
          country: n.name,
        }),
      );
      return;
    }
    setY(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: d,
        password: f,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: l,
            phone,
          },
        },
      });
      if (error) {
        throw error;
      }
      toast.success(t("auth.ok.created"));
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user != null && user.id) {
          supabase.functions.invoke("send-welcome", {
            body: {
              user_id: user.id,
            },
          });
        }
      } catch {}
    } catch (error) {
      console.error("Auth error:", error);
      const z = errorMessage(error, "Sign up failed");
      if (z.includes("User already registered")) {
        toast.error(t("auth.err.emailTaken"));
      } else {
        toast.error(z);
      }
    } finally {
      setY(false);
    }
  };
  const T = {
    phone: {
      title: "Welcome back",
      body: "Sign in with your phone. We text you a six-digit code - no password to forget.",
    },
    otp: {
      title: "Check WhatsApp",
      body: `We sent a six-digit code to ${phone}. It expires in a few minutes.`,
    },
    "email-signup": {
      title: "Create your account",
      body: "Prefer a password? Sign up with your email and we'll link your phone for WhatsApp.",
    },
  }[e];
  return (
    <div className="min-h-screen bg-alma-canvas font-body lg:grid lg:grid-cols-[46fr_54fr]">
      <AuthAside />
      <div className="relative flex min-h-screen flex-col px-5 py-8 lg:min-h-0 lg:bg-[linear-gradient(160deg,#eaf3fa_0%,#f6f9fc_55%)] lg:px-10 lg:py-12">
        <MobileSkyGradient />
        <AlmaHomeLink className="relative mx-auto lg:mx-0 lg:hidden" />
        <MobileOrbit />
        <div className="flex flex-1 flex-col items-center justify-start pt-2 lg:justify-center lg:py-10">
          <div className="relative w-full max-w-[420px] rounded-[26px] px-0 pb-8 pt-9 lg:border lg:border-[rgba(23,50,77,0.1)] lg:bg-white/[0.98] lg:px-9 lg:pt-[38px] lg:shadow-[0px_18px_48px_0px_rgba(23,50,77,0.12)]">
            <div className="flex flex-col gap-[9px]">
              <h2 className="font-display text-[30px] font-semibold leading-[1.2] text-alma-ink">{T.title}</h2>
              <p className="font-body text-[13.5px] leading-[21px] tracking-[0.135px] text-[rgba(23,50,77,0.6)]">
                {T.body}
              </p>
            </div>
            {e === "phone" && (
              <form onSubmit={S} className="mt-[18px] flex flex-col gap-[18px]">
                <PhoneInput country={n} onCountryChange={setN} value={s} onValueChange={setS} disabled={y} />
                <PrimaryButton type="submit" loading={y} withArrow>
                  {y ? "Sending code" : "Send code"}
                </PrimaryButton>
                <div className="flex items-center gap-3.5">
                  <div className="h-px flex-1 bg-[rgba(23,50,77,0.1)]" />
                  <span className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.42)]">or</span>
                  <div className="h-px flex-1 bg-[rgba(23,50,77,0.1)]" />
                </div>
                <OutlineButton type="button" onClick={C} disabled={y}>
                  <img src={iconGoogle} alt="" className="h-[18px] w-[18px]" />
                  {t("auth.google")}
                </OutlineButton>
                <p className="text-center font-body text-[11px] leading-[17px] tracking-[0.11px] text-[rgba(23,50,77,0.45)]">
                  {t("auth.terms")}
                </p>
              </form>
            )}
            {e === "otp" && (
              <form onSubmit={A} className="mt-[18px] flex flex-col gap-[18px]">
                <div className="flex w-full flex-col gap-[9px]">
                  <label
                    htmlFor="otp"
                    className="font-body text-[10px] font-medium tracking-[1px] text-[rgba(23,50,77,0.45)]"
                  >
                    {t("auth.codeLabel")}
                  </label>
                  <OtpInput
                    id="otp"
                    value={o}
                    onChange={setO}
                    disabled={y}
                    autoFocus
                    aria-label={t("auth.codeLabel")}
                  />
                </div>
                <PrimaryButton type="submit" loading={y} withArrow>
                  {y ? "Verifying" : "Verify and continue"}
                </PrimaryButton>
                <div className="flex items-center justify-between font-body text-[12.5px] tracking-[0.25px]">
                  <button
                    type="button"
                    disabled={y}
                    onClick={() => {
                      setO("");
                      setE("phone");
                    }}
                    className="text-[rgba(23,50,77,0.5)] underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    {t("auth.changeNumber")}
                  </button>
                  <button
                    type="button"
                    disabled={y}
                    onClick={S}
                    className="text-alma-accent-ring underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    {t("auth.resend")}
                  </button>
                </div>
              </form>
            )}
            {e === "email-signup" && (
              <form onSubmit={E} className="mt-[18px] flex flex-col gap-[18px]">
                <TextField
                  label={t("auth.fullName")}
                  id="name"
                  type="text"
                  placeholder={t("auth.namePlaceholder")}
                  autoComplete="name"
                  disabled={y}
                  value={l}
                  onChange={(I) => setL(I.target.value)}
                />
                <TextField
                  label={t("auth.email")}
                  id="email"
                  type="email"
                  dir="ltr"
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                  disabled={y}
                  value={d}
                  onChange={(I) => setD(I.target.value)}
                />
                <PhoneInput country={n} onCountryChange={setN} value={s} onValueChange={setS} disabled={y} />
                <TextField
                  label={t("auth.password")}
                  id="password"
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  autoComplete="new-password"
                  disabled={y}
                  value={f}
                  onChange={(I) => setF(I.target.value)}
                />
                <PrimaryButton type="submit" loading={y} withArrow>
                  {y ? "Creating account" : "Create account"}
                </PrimaryButton>
                <button
                  type="button"
                  disabled={y}
                  onClick={() => setE("phone")}
                  className="text-center font-body text-[12.5px] tracking-[0.25px] text-[rgba(23,50,77,0.5)] underline-offset-4 hover:underline disabled:opacity-50"
                >
                  {t("auth.backToPhone")}
                </button>
              </form>
            )}
          </div>
          {e === "phone" && (
            <p className="mt-[30px] text-center font-body text-[12.5px] tracking-[0.25px] text-[rgba(23,50,77,0.5)]">
              New here?  Creating an account takes one text message.{" "}
              <button
                type="button"
                onClick={() => setE("email-signup")}
                className="text-alma-accent-ring underline-offset-4 hover:underline"
              >
                {t("auth.useEmail")}
              </button>
            </p>
          )}
        </div>
        <PrivacyNote className="justify-center lg:hidden" />
      </div>
    </div>
  );
}
