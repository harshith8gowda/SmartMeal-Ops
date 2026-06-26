import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, PackagePlus, Sparkles, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMotion } from "@/components/dashboard/hero-motion";
import { Card } from "@/components/ui/card";
import { Show } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { HeroCTA } from "@/components/landing/hero-cta";

const bullets = [
  "Tonight's smartest move",
  "Save money. Eat better.",
  "Groceries or takeout? We'll decide."
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:py-8">
      <nav className="glass mb-10 flex items-center justify-between rounded-lg px-5 py-3">
        <p className="text-lg font-semibold">SmartMeal Ops</p>
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <Button asChild variant="secondary">
              <Link href={{ pathname: "/sign-in" }}>Sign In</Link>
            </Button>
            <Button asChild>
              <Link href={{ pathname: "/sign-up" }}>Get Started</Link>
            </Button>
          </Show>
        </div>
      </nav>

      <HeroMotion><section className="grid min-h-[calc(100vh-128px)] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-primary shadow-sm">
            <Sparkles className="h-4 w-4" />
            AI Household Food Copilot
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">Your AI Food Operations Copilot</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Plan meals, optimize costs, restock groceries, and make smarter dinner decisions with one intelligent assistant powered by Swiggy MCP.
          </p>
          <HeroCTA />
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm">
            <div className="metric"><Utensils className="mb-2 h-4 w-4 text-primary" />Cook</div>
            <div className="metric"><PackagePlus className="mb-2 h-4 w-4 text-primary" />Order</div>
            <div className="metric"><CalendarCheck className="mb-2 h-4 w-4 text-primary" />Dineout</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1400&q=80"
            alt="A dinner table with balanced bowls and fresh ingredients"
            width={1400}
            height={920}
            priority
            className="h-[520px] w-full rounded-lg object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 grid gap-3 md:grid-cols-3">
            {bullets.map((item) => (
              <Card key={item} className="bg-white/88 p-4 text-sm shadow-lg backdrop-blur">
                {item}
              </Card>
            ))}
          </div>
        </div>
      </section></HeroMotion>
    </main>
  );
}
