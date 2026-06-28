import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PackagePlus,
  Sparkles,
  Utensils,
  ShoppingBag,
  CalendarCheck,
  Scale,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMotion } from "@/components/dashboard/hero-motion";
import { ScrollReveal, StaggerReveal } from "@/components/landing/scroll-reveal";
import { Show, UserButton } from "@clerk/nextjs";
import { HeroCTA } from "@/components/landing/hero-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "MealMap — Decide dinner. Build the cart. Swiggy handles the rest."
  },
  description:
    "Compare cooking, ordering, and dining out side by side. Plan your week and build carts in Swiggy with one tap."
};

const steps = [
  {
    icon: Scale,
    title: "Compare options",
    body: "Set your budget, time, and mood. See cook, order, and dineout picks side by side."
  },
  {
    icon: CalendarCheck,
    title: "Plan the week",
    body: "Fill a 7-day meal planner with breakfast, lunch, and dinner slots."
  },
  {
    icon: ExternalLink,
    title: "Build in Swiggy",
    body: "MealMap creates the cart or booking and redirects you to Swiggy. No real orders placed here."
  }
];

export default function LandingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:py-8">
      <nav className="sticky top-4 z-50 mb-10 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.06] px-5 py-3 shadow-lg backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
            MM
          </div>
          <p className="font-display text-lg font-semibold">MealMap</p>
        </div>
        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <Button asChild variant="ghost" size="sm">
              <Link href={{ pathname: "/sign-in" }}>Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={{ pathname: "/sign-up" }}>Get Started</Link>
            </Button>
          </Show>
        </div>
      </nav>

      <HeroMotion>
        <section className="relative grid min-h-[calc(100vh-140px)] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative z-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
              Swiggy-powered food copilot
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
              Decide dinner. <span className="text-primary">Build the cart.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              MealMap compares cooking, ordering, and dining out, then builds your cart or booking in Swiggy with one tap.
            </p>
            <HeroCTA />

            <div className="mt-10 flex max-w-md gap-6">
              {[
                { icon: Utensils, label: "Cook" },
                { icon: ShoppingBag, label: "Order" },
                { icon: CalendarCheck, label: "Dineout" }
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-accent/15 to-warning/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80"
                alt="A premium dinner spread with fresh ingredients and warm candlelight"
                width={1600}
                height={1067}
                priority
                className="h-[420px] w-full object-cover lg:h-[540px]"
              />
            </div>
          </div>
        </section>
      </HeroMotion>

      <section className="mt-28 lg:mt-36">
        <ScrollReveal className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">What you can do</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            One copilot, three ways to eat
          </h2>
          <p className="mt-3 text-muted-foreground">
            MealMap connects your budget, time, and local Swiggy options so every dinner decision is effortless.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          <StaggerReveal className="premium-card p-8 md:row-span-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Scale className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl font-semibold">Side-by-side comparison</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              See the cost, time, and effort of cooking, ordering, and dining out for every meal. Pick what fits today.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Real-time budget and time filters
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Cook, order, and dineout cards
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                One-tap cart building in Swiggy
              </li>
            </ul>
          </StaggerReveal>

          <StaggerReveal className="premium-card p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold">Weekly meal planner</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Plan 7 days of breakfast, lunch, and dinner. Let AI fill slots or build carts for the whole week.
            </p>
          </StaggerReveal>

          <StaggerReveal className="premium-card p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <PackagePlus className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold">Pantry aware</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Track staples and recurring items so MealMap can suggest what to cook or add to your Instamart cart.
            </p>
          </StaggerReveal>
        </div>
      </section>

      <section className="mt-28 lg:mt-36">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            From question to dinner in three simple steps.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <StaggerReveal key={step.title} className="premium-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">0{i + 1}</p>
              <h3 className="mt-1 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </StaggerReveal>
          ))}
        </div>
      </section>

      <section className="mt-28 lg:mt-36 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent p-8 text-center md:p-12 lg:p-16">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to decide dinner faster?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join MealMap and let AI compare your options, plan your week, and build carts in Swiggy.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={{ pathname: "/sign-up" }}>
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={{ pathname: "/sign-in" }}>Already have an account?</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <footer className="mt-20 border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MealMap. Built with Clerk, Neon, OpenAI, and Swiggy MCP. No real orders are placed here.
      </footer>
    </main>
  );
}


