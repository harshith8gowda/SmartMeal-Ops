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
