import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChefHat,
  PackagePlus,
  Sparkles,
  Utensils,
  ShoppingBag,
  CalendarCheck,
  MessageSquareText,
  Scale,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMotion } from "@/components/dashboard/hero-motion";
import { ScrollReveal, StaggerReveal } from "@/components/landing/scroll-reveal";
import { Show, UserButton } from "@clerk/nextjs";
import { HeroCTA } from "@/components/landing/hero-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "SmartMeal Ops — AI Food Operations Copilot"
  },
  description:
    "Plan meals, optimize costs, restock groceries, and decide between cooking, ordering, and dining out with AI."
};

const steps = [
  {
    icon: MessageSquareText,
    title: "Ask the copilot",
    body: "Tell it your mood, budget, and time. It reads your pantry and preferences."
  },
  {
    icon: Scale,
    title: "Compare every option",
    body: "See the cost, time, and effort to cook, order, or book a table side by side."
  },
  {
    icon: CheckCircle2,
    title: "Confirm in one tap",
    body: "The copilot builds the cart, places the order, or reserves the table."
  }
];

export default function LandingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:py-8">
      <nav className="sticky top-4 z-50 mb-10 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.06] px-5 py-3 shadow-lg backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="font-display text-lg font-semibold">SmartMeal Ops</p>
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
              AI Household Food Copilot
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
              Your <span className="text-primary">AI Food Operations</span> Copilot
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Plan meals, optimize costs, restock groceries, and make smarter dinner decisions with one intelligent assistant.
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
            SmartMeal Ops connects your pantry, budget, and local Swiggy options so every dinner decision is effortless.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          <StaggerReveal className="premium-card p-8 md:row-span-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ChefHat className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl font-semibold">AI Meal Plans</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Weekly dinner plans tailored to your household size, budget, diet, and whatever is already in your pantry.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Budget-aware recipe suggestions
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Pantry-first ingredient matching
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Nutrition and cuisine preferences
              </li>
            </ul>
          </StaggerReveal>

          <StaggerReveal className="premium-card p-6 transition-transform duration-150 ease-out-strong hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold">Smart Decisions</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Cook, order, or dine out — the copilot compares cost, time, and effort to pick the best option.
            </p>
          </StaggerReveal>

          <StaggerReveal className="premium-card p-6 transition-transform duration-150 ease-out-strong hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <PackagePlus className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold">Pantry Tracking</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Track what you have and auto-build grocery restock lists when ingredients run low.
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
            Ready to eat smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join SmartMeal Ops and let AI decide between cooking, ordering, and dining out every night.
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
        © {new Date().getFullYear()} SmartMeal Ops. Built with Clerk, Neon, OpenAI, and Swiggy MCP.
      </footer>
    </main>
  );
}


