"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { GoalForm, type GoalPreference } from "@/components/goal/goal-form";
import { GoalProgress, type BudgetStatus } from "@/components/goal/goal-progress";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target } from "lucide-react";

function getWeekRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

function loadGoalData() {
  const { start, end } = getWeekRange();
  return Promise.all([
    fetch("/api/profile"),
    fetch("/api/budget"),
    fetch(`/api/meal-plan?start=${start.toISOString()}&end=${end.toISOString()}`)
  ]).then(async ([profileRes, budgetRes, slotsRes]) => {
    if (!profileRes.ok) throw new Error("Could not load profile");
    if (!budgetRes.ok) throw new Error("Could not load budget");
    if (!slotsRes.ok) throw new Error("Could not load meal plan");

    const profileData = await profileRes.json();
    const budgetData = await budgetRes.json();
    const slotsData = await slotsRes.json();

    return {
      profile: profileData as { user: { name?: string | null }; preference?: GoalPreference },
      budget: budgetData as BudgetStatus,
      slotsThisWeek: (slotsData.slots || []).length
    };
  });
}

export default function GoalPage() {
  const [profile, setProfile] = useState<{ user: { name?: string | null }; preference?: GoalPreference } | null>(null);
  const [budget, setBudget] = useState<BudgetStatus | null>(null);
  const [slotsThisWeek, setSlotsThisWeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoalData()
      .then((data) => {
        setProfile(data.profile);
        setBudget(data.budget);
        setSlotsThisWeek(data.slotsThisWeek);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  function refresh() {
    setLoading(true);
    setError(null);
    loadGoalData()
      .then((data) => {
        setProfile(data.profile);
        setBudget(data.budget);
        setSlotsThisWeek(data.slotsThisWeek);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }

  const preference = profile?.preference;
  const goalLabel = preference?.dietaryGoal
    ? preference.dietaryGoal.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Balanced";

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <ScrollReveal>
          <div className="mb-6">
            <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
              <Target className="h-4 w-4" /> Goals
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Stay on track, {profile?.user?.name || "there"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Set your budget and dietary goal, then watch MealMap keep your week aligned.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            <p className="mt-2">Loading goals...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-center">
            <p className="text-error">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {preference && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{goalLabel}</Badge>
                <Badge variant="secondary">₹{preference.monthlyBudget} / month</Badge>
                <Badge variant="secondary">{preference.householdSize} people</Badge>
              </div>
            )}
            {budget && <GoalProgress budget={budget} slotsThisWeek={slotsThisWeek} />}
            <GoalForm preference={preference} onUpdate={refresh} />
          </div>
        )}
      </main>
    </>
  );
}
