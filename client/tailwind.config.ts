const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-geist-mono)", "var(--font-mono)", "JetBrains Mono", "monospace"],
        cal: ["var(--font-cal-sans)", "var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        geist: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "DM Sans", "Inter", "system-ui", "sans-serif"],
        "work-sans": ["var(--font-work-sans)", "Work Sans", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#121212",       // very dark background for modern look
        foreground: "#e0e0e0",       // light foreground text for contrast

        primary: {
          50: "#f3e8ff",
          100: "#e0c0ff",
          200: "#c090ff",
          300: "#a360ff",
          400: "#7f32ff",
          500: "#6b1fe6",            // vibrant purple main
          600: "#5a17b4",
          700: "#4a1286",
          800: "#3a0d5a",
          900: "#2c0940",
          DEFAULT: "#6b1fe6",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#ffe3f1",
          100: "#ffb8d9",
          200: "#ff8fbe",
          300: "#ff669f",
          400: "#fc3c72",
          500: "#f2305d",             // bright pink
          600: "#c52249",
          700: "#991b3d",
          800: "#6d1230",
          900: "#4c0d25",
          DEFAULT: "#f2305d",
          foreground: "#fff",
        },
        accent: {
          50: "#d6f0f0",
          100: "#a5d3d2",
          200: "#74b5b4",
          300: "#409797",
          400: "#187c7c",
          500: "#0f6c6b",             // subdued teal accent
          600: "#0c5958",
          700: "#094644",
          800: "#062e32",
          900: "#041e22",
          DEFAULT: "#0f6c6b",
          foreground: "#daf5f4",
        },
        muted: {
          DEFAULT: "#6b7280",
          foreground: "#9ca3af",
        },
        card: {
          DEFAULT: "#1e293b", // slate-800 like dark card background
          foreground: "#f8fafc", // almost white text on cards
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      /*
      Custom animations and keyframes can be added here if needed.
      */
    },
  },
  plugins: [require("tailwindcss-animate")],
}
