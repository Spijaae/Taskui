import ringOuter from "@/assets/ring-outer.png";
import motif1 from "@/assets/motif-1.png";
import motif2 from "@/assets/motif-2.png";
import motif3 from "@/assets/motif-3.png";
import motif4 from "@/assets/motif-4.png";
import motif5 from "@/assets/motif-5.png";
import { Link } from "react-router-dom";
import logoMark from "@/assets/logo-mark.svg";
import { useI18n } from "@/i18n";

const iconShield =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/shield'%3e%3cpath%20id='Vector'%20d='M7%2012.8333C7%2012.8333%2011.6667%2010.5%2011.6667%207V2.91667L7%201.16667L2.33333%202.91667V7C2.33333%2010.5%207%2012.8333%207%2012.8333Z'%20stroke='%2317324d'%20stroke-opacity='0.4'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const orbitMiddle =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='400'%20height='156'%20viewBox='0%200%20400%20156'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='ring'%20d='M200%200.75C255.159%200.75%20305.062%209.47052%20341.148%2023.5439C359.194%2030.5816%20373.746%2038.9438%20383.774%2048.1904C393.802%2057.4363%20399.25%2067.5104%20399.25%2078C399.25%2088.4896%20393.802%2098.5637%20383.774%20107.81C373.746%20117.056%20359.194%20125.418%20341.148%20132.456C305.062%20146.529%20255.159%20155.25%20200%20155.25C144.841%20155.25%2094.9375%20146.529%2058.8516%20132.456C40.8062%20125.418%2026.2537%20117.056%2016.2256%20107.81C6.19818%2098.5637%200.75%2088.4896%200.75%2078C0.75%2067.5104%206.19818%2057.4363%2016.2256%2048.1904C26.2537%2038.9438%2040.8062%2030.5816%2058.8516%2023.5439C94.9375%209.47052%20144.841%200.75%20200%200.75Z'%20stroke='%23285e85'%20stroke-opacity='0.22'%20stroke-width='1.5'/%3e%3c/svg%3e";
export const orbitInner =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='240'%20height='92'%20viewBox='0%200%20240%2092'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='ring'%20d='M120%200.75C153.069%200.75%20182.974%205.88998%20204.584%2014.1738C215.392%2018.3167%20224.087%2023.2311%20230.066%2028.6504C236.046%2034.0696%20239.25%2039.9338%20239.25%2046C239.25%2052.0662%20236.046%2057.9304%20230.066%2063.3496C224.087%2068.7689%20215.392%2073.6833%20204.584%2077.8262C182.974%2086.11%20153.069%2091.25%20120%2091.25C86.9307%2091.25%2057.0261%2086.11%2035.416%2077.8262C24.6084%2073.6833%2015.9132%2068.7689%209.93359%2063.3496C3.95415%2057.9304%200.75%2052.0662%200.75%2046C0.75%2039.9338%203.95415%2034.0696%209.93359%2028.6504C15.9132%2023.2311%2024.6084%2018.3167%2035.416%2014.1738C57.0261%205.88998%2086.9307%200.75%20120%200.75Z'%20stroke='%23285e85'%20stroke-opacity='0.32'%20stroke-width='1.5'/%3e%3c/svg%3e";
export const orbitGlow =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='760'%20height='560'%20viewBox='0%200%20760%20560'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cellipse%20id='glow'%20cx='380'%20cy='280'%20rx='380'%20ry='280'%20fill='url(%23paint0_radial_0_215)'/%3e%3cdefs%3e%3cradialGradient%20id='paint0_radial_0_215'%20cx='0'%20cy='0'%20r='1'%20gradientUnits='userSpaceOnUse'%20gradientTransform='translate(380%20280)%20scale(380%20280)'%3e%3cstop%20stop-color='%232f6e99'%20stop-opacity='0.3'/%3e%3cstop%20offset='0.55'%20stop-color='%23285e85'%20stop-opacity='0.14'/%3e%3cstop%20offset='1'%20stop-color='%23285e85'%20stop-opacity='0'/%3e%3c/radialGradient%3e%3c/defs%3e%3c/svg%3e";
export const orbitCore =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='78'%20height='78'%20viewBox='0%200%2078%2078'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='core'%20filter='url(%23filter0_d_0_212)'%3e%3ccircle%20cx='39'%20cy='34'%20r='23'%20fill='url(%23paint0_linear_0_212)'/%3e%3ccircle%20cx='39'%20cy='34'%20r='21.5'%20stroke='white'%20stroke-width='3'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d_0_212'%20x='0'%20y='0'%20width='78'%20height='78'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='5'/%3e%3cfeGaussianBlur%20stdDeviation='8'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.129412%200%200%200%200%200.666667%200%200%200%200%200.309804%200%200%200%200.35%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow_0_212'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow_0_212'%20result='shape'/%3e%3c/filter%3e%3clinearGradient%20id='paint0_linear_0_212'%20x1='16'%20y1='34'%20x2='62'%20y2='34'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23285e85'/%3e%3cstop%20offset='1'%20stop-color='%232f6e99'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
const $B =
  "data:image/png;base64,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";
const ORBIT_PHOTOS = [
  {
    src: motif1,
    alt: "",
    left: 60.679,
    top: 40.825,
    width: 13.75,
    radius: 15,
    opacity: 0.91,
    shadow: "0px 10.294px 26.162px 0px rgba(23,50,77,0.15)",
  },
  {
    src: motif2,
    alt: "",
    left: 27.357,
    top: 23.857,
    width: 10.179,
    radius: 11,
    opacity: 0.69,
    shadow: "0px 5.706px 15.838px 0px rgba(23,50,77,0.09)",
  },
  {
    src: motif3,
    alt: "",
    left: 79.23,
    top: 41.94,
    width: 10.536,
    radius: 12,
    opacity: 0.85,
    shadow: "0px 9.035px 23.329px 0px rgba(23,50,77,0.14)",
  },
  {
    src: motif4,
    alt: "",
    left: 12.364,
    top: 47.008,
    width: 10.536,
    radius: 12,
    opacity: 0.88,
    shadow: "0px 9.69px 24.804px 0px rgba(23,50,77,0.15)",
  },
  {
    src: motif5,
    alt: "",
    left: 40.732,
    top: 78.206,
    width: 9.821,
    radius: 11,
    opacity: 1,
    shadow: "0px 11.985px 29.966px 0px rgba(23,50,77,0.18)",
  },
  {
    src: $B,
    alt: "",
    left: 71.607,
    top: 0.294,
    width: 6.786,
    radius: 8,
    opacity: 0.63,
    shadow: "0px 4.536px 13.206px 0px rgba(23,50,77,0.07)",
  },
];
function OrbitArt() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-[560px]"
      style={{
        aspectRatio: "560 / 252",
      }}
    >
      <img
        src={orbitGlow}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: "-17.857%",
          top: "-65.476%",
          width: "135.714%",
          height: "222.222%",
        }}
      />
      <img
        src={ringOuter}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: 0,
          top: "1.984%",
          width: "100%",
          height: "87.302%",
        }}
      />
      <img
        src={orbitMiddle}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: "14.286%",
          top: "14.683%",
          width: "71.429%",
          height: "61.905%",
        }}
      />
      <img
        src={orbitInner}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: "28.571%",
          top: "27.381%",
          width: "42.857%",
          height: "36.508%",
        }}
      />
      {ORBIT_PHOTOS.map((e) => (
        <div
          key={e.src}
          className="absolute overflow-hidden border-[3px] border-white"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            width: `${e.width}%`,
            aspectRatio: "1 / 1",
            borderRadius: e.radius,
            opacity: e.opacity,
            boxShadow: e.shadow,
          }}
        >
          <img src={e.src} alt={e.alt} className="h-full w-full object-cover" />
        </div>
      ))}
      <img
        src={orbitCore}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: "43.036%",
          top: "32.143%",
          width: "13.929%",
          aspectRatio: "1 / 1",
        }}
      />
    </div>
  );
}
export function AlmaHomeLink({ className = "" }) {
  const { t } = useI18n();
  return (
    <Link
      to="/"
      aria-label={t("nav.homeLink")}
      className={`inline-flex w-fit items-center gap-[6.72px] rounded-lg transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alma-accent-ring ${className}`}
    >
      <img src={logoMark} alt="" className="h-[36.9px] w-[31.1px]" />
      <span
        className="font-brand text-[15.36px] font-bold text-alma-wordmark"
        style={{
          fontVariationSettings: '"SOFT" 0, "WONK" 1',
        }}
      >
        ALMA AI
      </span>
    </Link>
  );
}
export function PrivacyNote({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={iconShield} alt="" className="h-3.5 w-3.5 shrink-0" />
      <span className="font-body text-xs tracking-[0.24px] text-[rgba(23,50,77,0.45)]">
        Private to your account  ·  export or delete any time
      </span>
    </div>
  );
}
export function AuthAside() {
  const { t } = useI18n();
  return (
    <div
      className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12"
      style={{
        backgroundImage: "linear-gradient(122.07deg, #dceaf6 0%, #f6f9fc 70.423%)",
      }}
    >
      <AlmaHomeLink />
      <div className="flex flex-1 items-center py-10">
        <OrbitArt />
      </div>
      <div className="pb-8">
        <h1 className="font-display text-[38px] font-semibold leading-[48px] text-alma-ink">
          {t("auth.everythingKept")}
          <br />
          in one place.
        </h1>
        <p className="mt-6 max-w-[470px] font-body text-[14.5px] leading-[25px] tracking-[0.145px] text-[rgba(23,50,77,0.62)]">
          ALMA remembers what you tell it - photos, voice notes, half-thoughts at midnight - and gives it back when it
          matters.
        </p>
      </div>
      <PrivacyNote />
    </div>
  );
}
