import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        body: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Bricolage Grotesque", "ui-sans-serif", "system-ui", "sans-serif"],
        brand: ["Fraunces", "ui-serif", "Georgia", "serif"],
        editorial: ["Newsreader", "ui-serif", "Georgia", "serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        memory: {
          purple: "hsl(var(--memory-purple))",
          blue: "hsl(var(--memory-blue))",
        },
        warm: {
          amber: "hsl(var(--warm-amber))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        azure: {
          50: "#F6F9FC",
          100: "#EAF3FA",
          200: "#D5E2EC",
          300: "#C8E1F2",
          400: "#8FB8D6",
          500: "#5C92B8",
          600: "#285E85",
          700: "#1F4D6E",
          900: "#0F2233",
        },
        person: {
          amber: "#F6E7DA",
          "amber-ink": "#8A5A24",
          blue: "#DCEAF6",
          "blue-ink": "#285E85",
          violet: "#E2DCF2",
          "violet-ink": "#4A4A99",
        },
        alma: {
          canvas: "#F6F9FC",
          field: "#F6F9FC",
          subtle: "#F8FBFD",
          sunken: "#EEF4F9",
          surface: "#FFFFFF",
          sidebar: "#FFFFFF",
          soft: "#EAF3FA",
          panel: "#C8E1F2",
          "panel-label": "#9DBCD4",
          "panel-text": "#CDDDEA",
          ink: "#17324D",
          wordmark: "#17324D",
          muted: "#526779",
          faint: "#8A98A8",
          line: "#D5E2EC",
          "line-strong": "#BFD0DE",
          "line-accent": "#9CC3DE",
          hairline: "#E2EBF3",
          core: "#4A90C4",
          action: "#285E85",
          "action-hover": "#1F4D6E",
          "accent-from": "#285E85",
          "accent-to": "#2F6E99",
          "accent-deep": "#285E85",
          "accent-ring": "#285E85",
          "azure-deep": "#A8D0E8",
        },
      },
      backgroundImage: {
        "gradient-memory": "var(--gradient-memory)",
        "gradient-warm": "var(--gradient-warm)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        glow: "var(--shadow-glow)",
      },
      opacity: {
        45: "0.45",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
