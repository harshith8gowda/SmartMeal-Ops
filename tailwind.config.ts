import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    fontFamily: {
      display: ["var(--font-display)", "system-ui", "sans-serif"],
      body: ["var(--font-body)", "system-ui", "sans-serif"],
    },
    colors: {
      background: "var(--color-background)",
      foreground: "var(--color-foreground)",
      primary: {
        DEFAULT: "var(--color-primary)",
        hover: "var(--color-primary-hover)",
        foreground: "var(--color-primary-foreground)",
        light: "var(--color-primary-light)",
      },
      secondary: {
        DEFAULT: "var(--color-secondary)",
        foreground: "var(--color-secondary-foreground)",
      },
      muted: {
        DEFAULT: "var(--color-muted)",
        foreground: "var(--color-muted-foreground)",
      },
      border: "var(--color-border)",
      cook: {
        DEFAULT: "var(--color-cook)",
        light: "var(--color-cook-light)",
      },
      order: {
        DEFAULT: "var(--color-order)",
        light: "var(--color-order-light)",
      },
      dineout: {
        DEFAULT: "var(--color-dineout)",
        light: "var(--color-dineout-light)",
      },
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      error: "var(--color-error)",
      info: "var(--color-info)",
      // Keep old aliases only during transition if needed; remove before final build.
      card: "var(--color-secondary)",
      "card-foreground": "var(--color-secondary-foreground)",
      ring: "var(--color-ring)",
    },
    borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      full: "var(--radius-full)",
    },
    boxShadow: {
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
      xl: "var(--shadow-xl)",
    },
    extend: {
      spacing: {
        "section-inner": "var(--spacing-section-inner)",
        "section-outer": "var(--spacing-section-outer)",
        hero: "var(--spacing-hero)",
      },
      fontSize: {
        display: ["var(--font-size-display)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1: ["var(--font-size-h1)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["var(--font-size-h2)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h3: ["var(--font-size-h3)", { lineHeight: "1.3" }],
        h4: ["var(--font-size-h4)", { lineHeight: "1.35" }],
        "body-lg": ["var(--font-size-body-lg)", { lineHeight: "1.6" }],
        body: ["var(--font-size-body)", { lineHeight: "1.6" }],
        small: ["var(--font-size-small)", { lineHeight: "1.5" }],
        caption: ["var(--font-size-caption)", { lineHeight: "1.4" }],
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
    }
  },
  plugins: []
} satisfies Config;
