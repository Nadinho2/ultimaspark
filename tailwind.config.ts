import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--app-bg)",
        surface: "var(--app-surface)",
        primary: "var(--app-primary)",
        spark: "var(--app-spark)",
        // Back-compat for components already using accent
        accent: "var(--app-spark)",
        growth: "var(--app-growth)",
        border: "var(--app-border)",
        text: {
          primary: "var(--app-text-primary)",
          secondary: "var(--app-text-secondary)",
        },
      },
    },
  },
};

export default config;

