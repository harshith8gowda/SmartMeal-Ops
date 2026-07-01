"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { NutritionChart } from "@/components/nutrition/nutrition-chart";
import { NutritionSummary } from "@/components/nutrition/nutrition-summary";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Flame, CalendarDays } from "lucide-react";
import { toast } from "sonner";

type NutritionLog = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function getWeekRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

export default function NutritionPage() {
  const [logs, setLogs] = useState<NutritionLog[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { start, end } = getWeekRange();
    fetch(`/api/nutrition?start=${start.toISOString()}&end=${end.toISOString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setLogs(data.logs || []);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load nutrition");
        setLogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filledLogs = logs?.filter((l) => l.calories > 0) ?? [];

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        <ScrollReveal>
          <div className="mb-6">
            <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
              <Flame className="h-4 w-4" /> Nutrition
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Nutrition tracking
            </h1>
            <p className="mt-2 text-muted-foreground">
              Daily totals from your meal plan. Add nutrition values when you edit a meal slot.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : filledLogs.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No nutrition data yet"
            description="Add meals to your plan and enter calories and macros in the slot sheet."
          />
        ) : (
          <div className="space-y-6">
            <NutritionChart logs={filledLogs} />
            <NutritionSummary logs={logs || []} />
          </div>
        )}
      </main>
    </>
  );
}
