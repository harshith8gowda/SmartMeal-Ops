"use client";

import { useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { InputBar, type InputValues } from "@/components/dashboard/input-bar";
import { ComparisonCardV2, ComparisonRecommendation } from "@/components/dashboard/comparison-card-v2";
import { CartSummary } from "@/components/dashboard/cart-summary";
import { DashboardHeaderV2 } from "@/components/dashboard/dashboard-header-v2";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";

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
        <ScrollReveal delay={0.1}>
          <div className="mb-8">
            <DashboardHeaderV2 />
            <div className="mt-6">
              <InputBar onChange={fetchRecommendations} />
            </div>
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
                <button
                  type="button"
                  onClick={() => setSelected(recommendations.cook)}
                  className="block w-full text-left"
                >
                  <ComparisonCardV2
                    mode={recommendations.cook.source}
                    title={recommendations.cook.title}
                    description={recommendations.cook.description}
                    price={`₹${recommendations.cook.cost}`}
                    time={`${recommendations.cook.timeMinutes} min`}
                  />
                </button>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <button
                  type="button"
                  onClick={() => setSelected(recommendations.order)}
                  className="block w-full text-left"
                >
                  <ComparisonCardV2
                    mode={recommendations.order.source}
                    title={recommendations.order.title}
                    description={recommendations.order.description}
                    price={`₹${recommendations.order.cost}`}
                    time={`${recommendations.order.timeMinutes} min`}
                  />
                </button>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <button
                  type="button"
                  onClick={() => setSelected(recommendations.dineout)}
                  className="block w-full text-left"
                >
                  <ComparisonCardV2
                    mode={recommendations.dineout.source}
                    title={recommendations.dineout.title}
                    description={recommendations.dineout.description}
                    price={`₹${recommendations.dineout.cost}`}
                    time={`${recommendations.dineout.timeMinutes} min`}
                  />
                </button>
              </ScrollReveal>
            </>
          )}
        </div>

        {selected && <CartSummary recommendation={selected} onClose={() => setSelected(null)} />}
      </main>
    </>
  );
}
