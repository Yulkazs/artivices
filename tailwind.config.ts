import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0c0a07",
          soft: "#141109",
          line: "#2c2820",
        },
        linen: {
          DEFAULT: "#f2ede2",
          dim: "#a89f8c",
          faint: "#6f6a5c",
        },
        clay: {
          DEFAULT: "#c9bda3",
          dark: "#a99a7c",
          light: "#ddd3bf",
        },
        mist: "#9aa1ad",
      },
      fontFamily: {
        logo: ["var(--font-logo)", "serif"],
        accent: ["var(--font-accent)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
      letterSpacing: {
        wideish: "0.01em",
      },
    },
  },
  plugins: [],
};

export default config;
