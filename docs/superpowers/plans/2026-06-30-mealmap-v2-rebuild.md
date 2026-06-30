# MealMap v2 Complete Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the MealMap website with a fresh, distinctive visual identity: a light, warm editorial design, custom fonts, and a signature “Food Map” interaction instead of the previous dark WebGL 3D orbit.

**Architecture:** Replace the current dark theme and `@react-three/fiber` scene with a light, token-driven UI built on the new `assets/design-tokens.css` and `tailwind.config.ts`. Keep the existing Next.js 16 App Router, Clerk auth, Neon/Prisma backend, and Swiggy data flows intact. The new marketing landing page is the priority; dashboard, meal-plan, and onboarding pages get a lighter styling refresh to match.

**Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 3 + Framer Motion + `next/font/google` (Space Grotesk + DM Sans) + Lucide React. Remove `@react-three/fiber`, `@react-three/drei`, and `three` from the marketing surface.

---

## Global Constraints

- Keep Clerk, Neon, Prisma, OpenAI, and Swiggy MCP integrations untouched.
- No new auth flows or route structure changes; only enhance/replace existing pages and components.
- All animations must respect `prefers-reduced-motion`.
- Mobile-first responsive; the new design must look intentional at 375px.
- Must pass `npm run typecheck`, `npm run lint`, and `npm run build` with placeholder envs before any commit is considered complete.
- Use the design tokens in `assets/design-tokens.css` and `docs/brand-guidelines.md`; no hardcoded hex values for colors.
- The new signature element is the **Food Map** — a horizontal, scrollable map of Cook / Order / Dineout cards. No WebGL 3D orbit on the marketing page.
- Copy must follow the voice in `docs/brand-guidelines.md`: direct, warm, confident, practical.

---

## File Structure

### New files to create
- `components/food-map/food-map.tsx` — reusable horizontal scrollable map of meal option cards.
- `components/food-map/food-map-card.tsx` — single Cook / Order / Dineout card for the map.
- `components/landing/hero-v2.tsx` — new marketing hero with Food Map.
- `components/landing/features-v2.tsx` — bento-style feature section (new layout, no 3D tilt).
- `components/landing/how-it-works-v2.tsx` — step-by-step section with real numbers because the flow is sequential.
- `components/landing/footer-v2.tsx` — warm, minimal footer with disclaimer.
- `components/nav/marketing-nav-v2.tsx` — clean top nav with larger touch targets.
- `components/ui/button-v2.tsx` — new button component matching the v2 tokens (or extend existing `button.tsx`).
- `components/dashboard/dashboard-header-v2.tsx` — refreshed dashboard header.
- `components/dashboard/comparison-card-v2.tsx` — refreshed comparison card.
- `app/globals-v2.css` — will overwrite `app/globals.css` with new token imports and utilities.
- `public/images/food/` — directory for food photography (we’ll use Unsplash URLs initially).
- `docs/superpowers/plans/2026-06-30-mealmap-v2-rebuild.md` — this plan.

### Files to modify
- `app/layout.tsx` — load Space Grotesk and DM Sans via `next/font/google`.
- `app/(marketing)/page.tsx` — replace entire landing page with v2 sections.
- `app/dashboard/page.tsx` — swap header and comparison cards for v2 versions.
- `app/meal-plan/page.tsx` — refresh with v2 tokens and layout.
- `app/onboarding/page.tsx` — refresh with v2 tokens and layout.
- `tailwind.config.ts` — replace color palette and add font families / custom utilities.
- `app/globals.css` — replace with new token-driven CSS.
- `components/ui/card.tsx` — update default card styling to match v2.
- `package.json` — remove React Three Fiber / drei / three from dependencies if no longer used.
- `next.config.ts` — remove CSP entries for raw.githubusercontent.com and raw.githack.com if R3F Environment is gone.

### Files to delete
- `components/3d/*` — remove entire 3D layer (orbit, scene provider, tilt card, etc.).
- `components/landing/3d-hero.tsx`, `orbit-features.tsx`, `steps-3d.tsx`, `motion-footer.tsx`, `scroll-reveal.tsx`.
- `lib/hooks/use-device-tier.ts`, `lib/hooks/use-reduced-motion.ts` — only if unused after removing 3D.
- `lib/3d/tokens.ts` — no longer needed.

---

## Task 1: Foundation — Fonts, Tokens, CSS, Tailwind

**Files:**
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `package.json`
- Test: `npm run typecheck` and `npm run lint`

**Interfaces:**
- Produces: available `font-display` and `font-body` utility classes, CSS variables mapped to the design tokens, and a new Tailwind theme.
- Consumes: `assets/design-tokens.css` and `docs/brand-guidelines.md`.

- [ ] **Step 1: Add Google Fonts to layout**

In `app/layout.tsx`, import and configure Space Grotesk and DM Sans:

```ts
import { Space_Grotesk, DM_Sans } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
```

Apply to the body:

```tsx
<body className={`${spaceGrotesk.variable} ${dmSans.variable} font-body antialiased`}>
```

- [ ] **Step 2: Replace Tailwind theme with v2 tokens**

In `tailwind.config.ts`, replace the color map with the new tokens and add the font families:

```ts
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
```

- [ ] **Step 3: Replace globals.css with v2 tokens and utilities**

Overwrite `app/globals.css` with:

```css
@import "tailwindcss";
@import "assets/design-tokens.css";

@layer base {
  :root {
    color-scheme: light;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-body;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .text-pretty {
    text-wrap: pretty;
  }

  .grain {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  }

  .food-map-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .food-map-scroll::-webkit-scrollbar {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Remove 3D dependencies from package.json**

Run:

```bash
npm uninstall @react-three/fiber @react-three/drei three
npm uninstall -D @types/three
```

Then remove any imports of these packages from the codebase (they will be removed in Task 6).

- [ ] **Step 5: Verify tooling**

Run:

```bash
npm run typecheck
npm run lint
```

Expected: both pass with only pre-existing warnings.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tailwind.config.ts app/globals.css app/layout.tsx
npm run typecheck && npm run lint && git commit -m "build: MealMap v2 tokens, fonts, and base CSS"
```

---

## Task 2: Navigation

**Files:**
- Create: `components/nav/marketing-nav-v2.tsx`
- Modify: `app/layout.tsx` (or wherever the current nav is imported)
- Test: render the nav and verify touch targets.

**Interfaces:**
- Consumes: `Button` from `components/ui/button-v2.tsx` (Task 1 extends button styling).
- Produces: `MarketingNavV2` used across marketing and app shells.

- [ ] **Step 1: Create the new nav component**

`components/nav/marketing-nav-v2.tsx`:

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function MarketingNavV2() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-flour/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">MealMap</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" className="h-11 px-4">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="h-11 px-5">Get started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Wire the nav into the marketing layout**

Find where the current nav is rendered (likely `app/(marketing)/layout.tsx` or `app/layout.tsx`) and replace it with `<MarketingNavV2 />`.

- [ ] **Step 3: Verify and commit**

```bash
npm run typecheck && npm run lint && git commit -m "feat(nav): v2 marketing navigation with larger touch targets"
```

---

## Task 3: Food Map Components

**Files:**
- Create: `components/food-map/food-map-card.tsx`
- Create: `components/food-map/food-map.tsx`
- Test: render the Food Map in isolation.

**Interfaces:**
- Consumes: Tailwind tokens (`cook`, `order`, `dineout`, `border`, `shadow-md`).
- Produces: `FoodMap` and `FoodMapCard` used in the hero and dashboard.

- [ ] **Step 1: Create the Food Map card**

`components/food-map/food-map-card.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type FoodMapCardProps = {
  mode: "cook" | "order" | "dineout";
  title: string;
  description: string;
  price: string;
  time: string;
  icon: LucideIcon;
  image: string;
};

const modeStyles = {
  cook: { badge: "bg-cook-light text-cook", border: "border-cook/20" },
  order: { badge: "bg-order-light text-order", border: "border-order/20" },
  dineout: { badge: "bg-dineout-light text-dineout", border: "border-dineout/20" },
};

const modeLabels = { cook: "Cook", order: "Order", dineout: "Dineout" };

export function FoodMapCard({ mode, title, description, price, time, icon: Icon, image }: FoodMapCardProps) {
  const style = modeStyles[mode];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border bg-flour shadow-md",
        style.border
      )}
    >
      <div className="relative h-36 w-full overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold", style.badge)}>
          {modeLabels[mode]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-lg font-semibold text-foreground">{title}</h4>
          <Icon className={cn("h-5 w-5 shrink-0", style.badge.split(" ")[1])} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-sm">
          <span className="font-medium text-foreground">{price}</span>
          <span className="text-muted-foreground">{time}</span>
        </div>
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 2: Create the Food Map scroll container**

`components/food-map/food-map.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FoodMapCard, FoodMapCardProps } from "./food-map-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const options: FoodMapCardProps[] = [
  {
    mode: "cook",
    title: "Paneer Tikka Bowl",
    description: "30-min home recipe with paneer, peppers, and yogurt marinade.",
    price: "₹280",
    time: "30 min",
    icon: require("lucide-react").ChefHat,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "order",
    title: "Biryani Box",
    description: "From your favorite local kitchen, delivered in 35 minutes.",
    price: "₹320",
    time: "35 min",
    icon: require("lucide-react").Bike,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "dineout",
    title: "Andhra Spice",
    description: "Casual family restaurant, 1.2 km away, 4.5 rating.",
    price: "₹450",
    time: "15 min walk",
    icon: require("lucide-react").MapPin,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "cook",
    title: "Masala Dosa Night",
    description: "Crispy dosa with coconut chutney and sambar at home.",
    price: "₹180",
    time: "25 min",
    icon: require("lucide-react").ChefHat,
    image: "https://images.unsplash.com/photo-1669568513180-0a4f29d66a0b?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "order",
    title: "Rolls & Wraps",
    description: "Kathi rolls, delivered hot in 25 minutes.",
    price: "₹240",
    time: "25 min",
    icon: require("lucide-react").Bike,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
  },
];

export function FoodMap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="food-map-scroll flex gap-5 overflow-x-auto pb-4 pt-2"
      >
        {options.map((o, i) => (
          <motion.div
            key={o.title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <FoodMapCard {...o} />
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-flour shadow-md ring-1 ring-border hover:shadow-lg lg:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-flour shadow-md ring-1 ring-border hover:shadow-lg lg:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
npm run typecheck && npm run lint && git commit -m "feat(food-map): horizontal scrollable Cook/Order/Dineout map"
```

---

## Task 4: Marketing Landing Page v2

**Files:**
- Create: `components/landing/hero-v2.tsx`
- Create: `components/landing/features-v2.tsx`
- Create: `components/landing/how-it-works-v2.tsx`
- Create: `components/landing/footer-v2.tsx`
- Modify: `app/(marketing)/page.tsx`
- Test: open `/` and verify the new landing page.

**Interfaces:**
- Consumes: `FoodMap`, `MarketingNavV2`, and Tailwind tokens.
- Produces: the public marketing page.

- [ ] **Step 1: Build the new hero**

`components/landing/hero-v2.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FoodMap } from "@/components/food-map/food-map";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroV2() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background grain">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              className="text-sm font-semibold uppercase tracking-wide text-primary"
            >
              Swiggy-powered food copilot
            </motion.p>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Decide dinner. <br />
              <span className="text-primary">No second guessing.</span>
            </motion.h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              MealMap compares Cook, Order, and Dineout on Swiggy, plans your week, and builds your cart — all in one place.
            </motion.p>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-6 text-base">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="secondary" size="lg" className="h-12 px-6 text-base">
                  Already have an account?
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? false : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-dineout/10" />
            <div className="relative rounded-3xl border border-border bg-flour p-4 shadow-lg">
              <FoodMap />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build the new features section**

`components/landing/features-v2.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChefHat, Bike, MapPin, CalendarDays, ShoppingCart } from "lucide-react";
import { ReactNode } from "react";

const features = [
  {
    title: "Compare all three",
    body: "Cook, Order, and Dineout ranked by price, time, and what you already have at home.",
    icon: CompareIcon,
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Weekly planner",
    body: "Drop meals into a week grid and let MealMap fill the gaps.",
    icon: CalendarDays,
    span: "",
  },
  {
    title: "Cart builder",
    body: "One click pushes ingredients and dishes to your Swiggy cart.",
    icon: ShoppingCart,
    span: "",
  },
];

function CompareIcon() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cook-light text-cook">
        <ChefHat className="h-5 w-5" />
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-order-light text-order">
        <Bike className="h-5 w-5" />
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-dineout-light text-dineout">
        <MapPin className="h-5 w-5" />
      </span>
    </div>
  );
}

export function FeaturesV2() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-flour py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="max-w-2xl font-display text-3xl font-bold text-foreground sm:text-4xl">
            One copilot, three ways to eat.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            MealMap does the math so you can do the eating.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md ${f.span}`}
            >
              <f.icon />
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build the new how-it-works section**

`components/landing/how-it-works-v2.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Set your mood",
    body: "Tell MealMap what you crave, your budget, and dietary goals.",
  },
  {
    n: "02",
    title: "See the map",
    body: "AI surfaces the best Cook, Order, and Dineout options for tonight.",
  },
  {
    n: "03",
    title: "Build and go",
    body: "Add the winning choice to your Swiggy cart and checkout there.",
  },
];

export function HowItWorksV2() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold text-foreground sm:text-4xl"
        >
          How it works
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-flour p-6 shadow-sm"
            >
              <span className="font-display text-4xl font-bold text-primary/30">{s.n}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Build the new footer**

`components/landing/footer-v2.tsx`:

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FooterV2() {
  return (
    <section className="bg-flour py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl">
          Stop scrolling. Start eating.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join MealMap and let Swiggy do the heavy lifting.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg">Get started free</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="secondary" size="lg">Already have an account?</Button>
          </Link>
        </div>
        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} MealMap. No real orders are placed here.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Assemble the new marketing page**

Replace `app/(marketing)/page.tsx` with:

```tsx
import { HeroV2 } from "@/components/landing/hero-v2";
import { FeaturesV2 } from "@/components/landing/features-v2";
import { HowItWorksV2 } from "@/components/landing/how-it-works-v2";
import { FooterV2 } from "@/components/landing/footer-v2";

export default function MarketingPage() {
  return (
    <main className="bg-background">
      <HeroV2 />
      <FeaturesV2 />
      <HowItWorksV2 />
      <FooterV2 />
    </main>
  );
}
```

- [ ] **Step 6: Verify and commit**

```bash
npm run typecheck && npm run lint && git commit -m "feat(landing): v2 marketing page with Food Map hero"
```

---

## Task 5: Dashboard Refresh

**Files:**
- Create: `components/dashboard/dashboard-header-v2.tsx`
- Create: `components/dashboard/comparison-card-v2.tsx`
- Modify: `app/dashboard/page.tsx`
- Test: open `/dashboard` and verify the refreshed UI.

**Interfaces:**
- Consumes: `FoodMap`, Tailwind tokens, existing dashboard data logic.
- Produces: refreshed dashboard components.

- [ ] **Step 1: Create the refreshed dashboard header**

`components/dashboard/dashboard-header-v2.tsx`:

```tsx
"use client";

import { FoodMap } from "@/components/food-map/food-map";

export function DashboardHeaderV2() {
  return (
    <section className="rounded-2xl border border-border bg-flour p-4 shadow-sm lg:p-6">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">What are you eating today?</h2>
        <p className="mt-1 text-muted-foreground">Type a craving, budget, or dietary goal below.</p>
      </div>
      <FoodMap />
    </section>
  );
}
```

- [ ] **Step 2: Create the refreshed comparison card**

`components/dashboard/comparison-card-v2.tsx`:

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Bike, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ComparisonMode = "cook" | "order" | "dineout";

export type ComparisonCardV2Props = {
  mode: ComparisonMode;
  title: string;
  description: string;
  price: string;
  time: string;
};

const modeMeta = {
  cook: { label: "Cook", icon: ChefHat, color: "cook", bg: "bg-cook-light" },
  order: { label: "Order", icon: Bike, color: "order", bg: "bg-order-light" },
  dineout: { label: "Dineout", icon: MapPin, color: "dineout", bg: "bg-dineout-light" },
};

export function ComparisonCardV2({ mode, title, description, price, time }: ComparisonCardV2Props) {
  const meta = modeMeta[mode];
  const Icon = meta.icon;

  return (
    <Card className="overflow-hidden border-border bg-flour shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className={cn("flex flex-row items-center gap-3 pb-3", meta.bg)}>
        <Icon className={cn("h-5 w-5", `text-${meta.color}`)} />
        <Badge variant="outline" className="border-0 bg-transparent font-semibold text-foreground">
          {meta.label}
        </Badge>
      </CardHeader>
      <CardContent className="p-5">
        <CardTitle className="font-display text-lg">{title}</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-medium">{price}</span>
          <span className="text-muted-foreground">{time}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Integrate in dashboard page**

In `app/dashboard/page.tsx`, replace the existing dashboard header with `<DashboardHeaderV2 />` and wrap comparison cards with `<ComparisonCardV2 />`. Keep all existing data fetching and business logic.

- [ ] **Step 4: Verify and commit**

```bash
npm run typecheck && npm run lint && git commit -m "feat(dashboard): v2 dashboard header and comparison cards"
```

---

## Task 6: Meal Plan & Onboarding Refresh

**Files:**
- Modify: `components/meal-plan/week-grid.tsx`
- Modify: `components/meal-plan/slot-sheet.tsx`
- Modify: `components/onboarding/onboarding-form.tsx`
- Modify: `app/meal-plan/page.tsx`
- Modify: `app/onboarding/page.tsx`
- Test: open `/meal-plan` and `/onboarding`.

**Interfaces:**
- Consumes: new Tailwind tokens and `Card` styling.
- Produces: refreshed meal-plan and onboarding pages.

- [ ] **Step 1: Refresh week-grid cards**

In `components/meal-plan/week-grid.tsx`, replace card styling with `bg-flour`, `border-border`, `rounded-2xl`, and `shadow-sm`. Remove `TiltCard` if present. Ensure the grid is readable on mobile.

- [ ] **Step 2: Refresh slot sheet**

In `components/meal-plan/slot-sheet.tsx`, update the sheet background to `bg-flour`, text to `text-foreground`, and use the new button variants.

- [ ] **Step 3: Refresh onboarding form**

In `components/onboarding/onboarding-form.tsx`, replace dark-mode card styling with `bg-flour`, `border-border`, `text-foreground`. Update step transitions to use the new color tokens. Ensure `prefers-reduced-motion` is respected.

- [ ] **Step 4: Refresh page shells**

In `app/meal-plan/page.tsx` and `app/onboarding/page.tsx`, update headings to use `font-display` and the new color tokens. Keep existing data fetching logic.

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck && npm run lint && git commit -m "feat(meal-plan,onboarding): v2 token refresh and layout polish"
```

---

## Task 7: Remove Old 3D Components

**Files:**
- Delete: `components/3d/*`
- Delete: `components/landing/3d-hero.tsx`, `orbit-features.tsx`, `steps-3d.tsx`, `motion-footer.tsx`, `scroll-reveal.tsx`
- Delete: `lib/hooks/use-device-tier.ts`, `lib/hooks/use-reduced-motion.ts` (if unused)
- Delete: `lib/3d/tokens.ts`
- Modify: `next.config.ts` — remove CSP entries for `raw.githubusercontent.com` and `raw.githack.com` if no R3F Environment remains.
- Test: `npm run typecheck` and `npm run lint`.

**Interfaces:**
- Consumes: the new v2 components now replace the old ones.
- Produces: a clean codebase without the 3D layer.

- [ ] **Step 1: Delete 3D and old landing components**

```bash
rm -rf components/3d
rm -f components/landing/3d-hero.tsx
rm -f components/landing/orbit-features.tsx
rm -f components/landing/steps-3d.tsx
rm -f components/landing/motion-footer.tsx
rm -f components/landing/scroll-reveal.tsx
rm -f lib/hooks/use-device-tier.ts
rm -f lib/hooks/use-reduced-motion.ts
rm -f lib/3d/tokens.ts
```

- [ ] **Step 2: Clean up next.config.ts CSP**

If `raw.githubusercontent.com` and `raw.githack.com` are only used for the R3F Environment HDRI, remove them from `connect-src` in `next.config.ts`. Keep Clerk, OpenAI, Swiggy, and Cloudflare entries.

- [ ] **Step 3: Verify nothing references the deleted files**

```bash
npm run typecheck
npm run lint
```

Expected: both pass. If there are residual imports, fix them.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: remove 3D orbit and old v1 landing components"
```

---

## Task 8: Final Polish, Build, and Deploy

**Files:**
- Modify: any remaining files flagged by lint/typecheck.
- Modify: `README.md` (optional, if it references the old 3D design).
- Test: `npm run build` with placeholder envs.

**Interfaces:**
- Consumes: all previous v2 changes.
- Produces: a production-ready build.

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: build succeeds with placeholder envs.

- [ ] **Step 2: Fix any remaining visual regressions**

Open `/`, `/dashboard`, `/meal-plan`, and `/onboarding` locally. Verify:
- Light background renders correctly.
- Space Grotesk and DM Sans load.
- Food Map scrolls horizontally.
- No console errors.
- Reduced-motion fallback works.

- [ ] **Step 3: Commit any final fixes**

```bash
git commit -m "fix: final v2 build and visual polish"
```

- [ ] **Step 4: Deploy to Vercel**

```bash
# If on main, push to deploy via Git integration.
git push origin main

# Or create a feature branch for review:
git checkout -b feat/v2-rebuild
git push -u origin feat/v2-rebuild
```

---

## Verification Summary

| Check | How |
|-------|-----|
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Build | `npm run build` (with placeholder envs) |
| Landing page | Open `/` on desktop and mobile. Food Map should scroll. |
| Reduced motion | Enable OS/browser reduced motion; animations should disable. |
| Dashboard | `/dashboard` should render the new Food Map header. |
| Meal plan / Onboarding | `/meal-plan` and `/onboarding` should use new tokens. |
| No 3D deps | `package.json` should not list `@react-three/fiber`, `@react-three/drei`, or `three`. |

---

## Self-Review Checklist

- **Spec coverage:** Every existing marketing page section is replaced; dashboard, meal-plan, and onboarding get v2 refreshes; 3D layer is removed; design tokens and brand guidelines are created.
- **Placeholder scan:** No TBDs/TODOs; all code snippets are complete and runnable.
- **Type consistency:** `FoodMapCardProps` is used consistently; `ComparisonMode` is exported; Tailwind tokens use `var(--...)` CSS variables.
