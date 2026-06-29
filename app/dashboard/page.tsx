"use client";

import { useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { InputBar, type InputValues } from "@/components/dashboard/input-bar";
import { ComparisonCard, type ComparisonRecommendation } from "@/components/dashboard/comparison-card";
import { CartSummary } from "@/components/dashboard/cart-summary";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

type Recommendations = {
  cook: ComparisonRecommendation;
  order: ComparisonRecommendation;
  dineout: ComparisonRecommendation;
};

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ComparisonRecommendation | null>(null);

  async function fetchRecommendations(input: InputValues) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        budget: String(input.budget),
        time: String(input.timeMinutes),
        mood: input.mood
      });
      const res = await fetch(`/api/recommendations?${params.toString()}`);
      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <ScrollReveal>
          <div className="mb-8">
            <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
              <Sparkles className="h-4 w-4" /> MealMap
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Tonight&apos;s options</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Compare cooking, ordering, and dining out side by side. Pick one and we&apos;ll build the cart in Swiggy.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mb-8">
            <InputBar onChange={fetchRecommendations} />
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {loading || !recommendations ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="premium-card flex flex-col p-5">
                <Skeleton className="mb-5 h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <Skeleton className="mt-auto h-10 w-full" />
              </div>
            ))
          ) : (
            <>
              <ScrollReveal delay={0.2}>
                <ComparisonCard
                  recommendation={recommendations.cook}
                  onSelect={() => setSelected(recommendations.cook)}
                />
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <ComparisonCard
                  recommendation={recommendations.order}
                  onSelect={() => setSelected(recommendations.order)}
                />
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <ComparisonCard
                  recommendation={recommendations.dineout}
                  onSelect={() => setSelected(recommendations.dineout)}
                />
              </ScrollReveal>
            </>
          )}
        </div>

        {selected && <CartSummary recommendation={selected} onClose={() => setSelected(null)} />}
      </main>
    </>
  );
}
