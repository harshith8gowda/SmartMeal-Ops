import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMotion } from "@/components/dashboard/hero-motion";

const bullets = [
  "Tonight’s smartest move",
  "Save money. Eat better.",
  "Groceries or takeout? We’ll decide."
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-14">
      <nav className="glass mb-16 flex items-center justify-between rounded-2xl px-5 py-3">
        <p className="text-lg font-semibold">SmartMeal Ops</p>
        <Button asChild>
          <Link href="/onboarding">Get Started</Link>
        </Button>
      </nav>

      <HeroMotion><section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            <Sparkles className="h-4 w-4" />
            AI Household Food Copilot
          </div>
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">Your AI Food Operations Copilot</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Plan meals, optimize costs, restock groceries, and make smarter dinner decisions with one intelligent assistant powered by Swiggy MCP.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/chat">Try AI Assistant</Link>
            </Button>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <p className="text-sm font-medium uppercase text-slate-500">What you can ask</p>
          <ul className="mt-5 space-y-4">
            {bullets.map((item) => (
              <li key={item} className="rounded-xl border border-slate-200 bg-white/80 p-4 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section></HeroMotion>
    </main>
  );
}
