import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarCheck, ChefHat, PackagePlus, Sparkles, Utensils, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMotion } from "@/components/dashboard/hero-motion";
import { Card } from "@/components/ui/card";
import { Show } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { HeroCTA } from "@/components/landing/hero-cta";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "SmartMeal Ops — AI Food Operations Copilot"
  },
  description: "Plan meals, optimize costs, restock groceries, and decide between cooking, ordering, and dining out with AI."
};

const features = [
  {
    icon: ChefHat,
    title: "AI Meal Plans",
    description: "Weekly dinner plans tailored to your budget, diet, and pantry."
  },
  {
    icon: Zap,
    title: "Smart Decisions",
    description: "Cook, order, or dine out — the copilot picks the cheapest option."
  },
  {
    icon: PackagePlus,
    title: "Pantry Tracking",
    description: "Track what you have and auto-build grocery restock lists."
  }
];

const bullets = [
  "Tonight's smartest move",
  "Save money. Eat better.",
  "Groceries or takeout? We'll decide."
];

export default function LandingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:py-8">
      <nav className="glass-strong sticky top-4 z-50 mb-10 flex items-center justify-between rounded-2xl px-5 py-3">
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
            <Badge variant="default" className="mb-6">
              <Sparkles className="mr-1.5 h-3 w-3" /> AI Household Food Copilot
            </Badge>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
              Your <span className="text-gradient">AI Food Operations</span> Copilot
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Plan meals, optimize costs, restock groceries, and make smarter dinner decisions with one intelligent assistant powered by Swiggy MCP.
            </p>
            <HeroCTA />

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                { icon: Utensils, label: "Cook" },
                { icon: PackagePlus, label: "Order" },
                { icon: CalendarCheck, label: "Dineout" }
              ].map((item) => (
                <div
                  key={item.label}
                  className="metric flex flex-col items-center gap-2 text-center"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1400&q=80"
                alt="A dinner table with balanced bowls and fresh ingredients"
                width={1400}
                height={920}
                priority
                className="h-[420px] w-full object-cover lg:h-[520px]"
              />
              <div className="absolute inset-x-4 bottom-4 grid gap-3 md:grid-cols-3">
                {bullets.map((item) => (
                  <Card key={item} className="border-white/10 bg-black/40 p-3 text-center text-sm text-white/90 backdrop-blur-md">
                    {item}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </HeroMotion>

      <section className="mt-24 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group gradient-border p-6 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </section>

      <section className="mt-24 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent p-8 text-center md:p-12 lg:p-16">
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
      </section>

      <footer className="mt-20 border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SmartMeal Ops. Built with Clerk, Neon, OpenAI, and Swiggy MCP.
      </footer>
    </main>
  );
}
