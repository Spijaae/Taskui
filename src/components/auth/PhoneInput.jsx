import { useI18n } from "@/i18n";

const iconDown =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/down'%3e%3cpath%20id='Vector'%20d='M3.75%205.625L7.5%209.375L11.25%205.625'%20stroke='%2317324d'%20stroke-opacity='0.5'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
export const COUNTRIES = [
  {
    code: "+91",
    name: "India",
    flag: "🇮🇳",
    iso: "IN",
  },
  {
    code: "+1",
    name: "United States",
    flag: "🇺🇸",
    iso: "US",
  },
  {
    code: "+1",
    name: "Canada",
    flag: "🇨🇦",
    iso: "CA",
  },
  {
    code: "+44",
    name: "United Kingdom",
    flag: "🇬🇧",
    iso: "GB",
  },
  {
    code: "+61",
    name: "Australia",
    flag: "🇦🇺",
    iso: "AU",
  },
  {
    code: "+971",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    iso: "AE",
  },
  {
    code: "+966",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    iso: "SA",
  },
  {
    code: "+65",
    name: "Singapore",
    flag: "🇸🇬",
    iso: "SG",
  },
  {
    code: "+49",
    name: "Germany",
    flag: "🇩🇪",
    iso: "DE",
  },
  {
    code: "+33",
    name: "France",
    flag: "🇫🇷",
    iso: "FR",
  },
  {
    code: "+34",
    name: "Spain",
    flag: "🇪🇸",
    iso: "ES",
  },
  {
    code: "+39",
    name: "Italy",
    flag: "🇮🇹",
    iso: "IT",
  },
  {
    code: "+31",
    name: "Netherlands",
    flag: "🇳🇱",
    iso: "NL",
  },
  {
    code: "+46",
    name: "Sweden",
    flag: "🇸🇪",
    iso: "SE",
  },
  {
    code: "+48",
    name: "Poland",
    flag: "🇵🇱",
    iso: "PL",
  },
  {
    code: "+7",
    name: "Russia",
    flag: "🇷🇺",
    iso: "RU",
  },
  {
    code: "+90",
    name: "Turkey",
    flag: "🇹🇷",
    iso: "TR",
  },
  {
    code: "+55",
    name: "Brazil",
    flag: "🇧🇷",
    iso: "BR",
  },
  {
    code: "+52",
    name: "Mexico",
    flag: "🇲🇽",
    iso: "MX",
  },
  {
    code: "+81",
    name: "Japan",
    flag: "🇯🇵",
    iso: "JP",
  },
  {
    code: "+82",
    name: "South Korea",
    flag: "🇰🇷",
    iso: "KR",
  },
  {
    code: "+86",
    name: "China",
    flag: "🇨🇳",
    iso: "CN",
  },
  {
    code: "+852",
    name: "Hong Kong",
    flag: "🇭🇰",
    iso: "HK",
  },
  {
    code: "+92",
    name: "Pakistan",
    flag: "🇵🇰",
    iso: "PK",
  },
  {
    code: "+880",
    name: "Bangladesh",
    flag: "🇧🇩",
    iso: "BD",
  },
  {
    code: "+62",
    name: "Indonesia",
    flag: "🇮🇩",
    iso: "ID",
  },
  {
    code: "+63",
    name: "Philippines",
    flag: "🇵🇭",
    iso: "PH",
  },
  {
    code: "+84",
    name: "Vietnam",
    flag: "🇻🇳",
    iso: "VN",
  },
  {
    code: "+66",
    name: "Thailand",
    flag: "🇹🇭",
    iso: "TH",
  },
  {
    code: "+234",
    name: "Nigeria",
    flag: "🇳🇬",
    iso: "NG",
  },
  {
    code: "+254",
    name: "Kenya",
    flag: "🇰🇪",
    iso: "KE",
  },
  {
    code: "+27",
    name: "South Africa",
    flag: "🇿🇦",
    iso: "ZA",
  },
];
export function PhoneInput({ country, onCountryChange, value, onValueChange, disabled }) {
  const { t: t_1 } = useI18n();
  return (
    <div className="flex w-full flex-col gap-[9px]">
      <label htmlFor="phone" className="font-body text-[10px] font-medium tracking-[1px] text-[rgba(23,50,77,0.45)]">
        {t_1("auth.phoneNumber")}
      </label>
      <div className="flex h-[54px] w-full items-center overflow-hidden rounded-[14px] border border-[rgba(23,50,77,0.14)] bg-alma-field transition-colors focus-within:border-alma-accent-deep">
        <div className="relative flex h-full items-center gap-1.5 ps-4 pe-3">
          <span className="font-body text-sm font-medium tracking-[0.28px] text-[rgba(23,50,77,0.9)]">
            {country.iso}  {country.code}
          </span>
          <img src={iconDown} alt="" className="h-[15px] w-[15px] shrink-0" />
          <select
            aria-label={t_1("auth.countryCode")}
            disabled={disabled}
            value={country.iso}
            onChange={(o) => {
              const a = COUNTRIES.find((l) => l.iso === o.target.value);
              if (a) {
                onCountryChange(a);
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          >
            {COUNTRIES.map((o) => (
              <option key={o.iso} value={o.iso}>
                {o.flag} {o.name} ({o.code})
              </option>
            ))}
          </select>
        </div>
        <div className="h-[26px] w-px shrink-0 bg-[rgba(23,50,77,0.14)]" />
        <input
          id="phone"
          type="tel"
          dir="ltr"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="98765 43210"
          disabled={disabled}
          value={value}
          onChange={(o) => onValueChange(o.target.value.replace(/[^\d\s]/g, "").slice(0, 18))}
          className="h-full min-w-0 flex-1 bg-transparent ps-3.5 pe-4 font-body text-[15px] tracking-[0.3px] text-[rgba(23,50,77,0.92)] outline-none placeholder:text-[rgba(23,50,77,0.32)] disabled:opacity-60"
        />
      </div>
    </div>
  );
}
