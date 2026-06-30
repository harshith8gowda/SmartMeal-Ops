"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { InputBar, type InputValues } from "@/components/dashboard/input-bar";
import { ComparisonCardV2, ComparisonRecommendation } from "@/components/dashboard/comparison-card-v2";
import { CartSummary } from "@/components/dashboard/cart-summary";
import { DashboardHeaderV2 } from "@/components/dashboard/dashboard-header-v2";
import { BudgetOverview } from "@/components/charts/budget-overview";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Wallet, Sparkles } from "lucide-react";

type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};

type Preference = {
  diet: string[];
  allergies: string[];
  cuisines: string[];
  householdSize: number;
  monthlyBudget: number;
  cookingSkill: string;
  dietaryGoal: string;
};

type Address = {
  id: string;
  label: string;
  isDefault: boolean;
};

type ProfileData = {
  user: UserProfile;
  preference: Preference | null;
  addresses: Address[];
};

type Recommendations = {
  cook: ComparisonRecommendation;
  order: ComparisonRecommendation;
  dineout: ComparisonRecommendation;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [budget, setBudget] = useState<{ monthlyBudget: number; spent: number; bySource: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ComparisonRecommendation | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data));
    fetch("/api/budget")
      .then((res) => res.json())
      .then((data) => setBudget(data));
  }, []);

  async function fetchRecommendations(input: InputValues) {
    setLoading(true);
    try {
      const defaultAddress = profile?.addresses?.find((a) => a.isDefault) || profile?.addresses?.[0];
      const params = new URLSearchParams({
        budget: String(input.budget),
        time: String(input.timeMinutes),
        mood: input.mood,
        ...(defaultAddress ? { addressId: defaultAddress.id } : {})
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
            <DashboardHeaderV2 user={profile?.user} preference={profile?.preference} />
            <div className="mt-6">
              <InputBar
                key={profile?.preference ? "loaded" : "default"}
                onChange={fetchRecommendations}
                preference={profile?.preference}
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-border bg-flour p-5 shadow-sm">
                <Skeleton className="mb-5 h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <Skeleton className="mt-auto h-10 w-full" />
              </div>
            ))
          ) : !recommendations ? (
            <div className="md:col-span-3">
              <EmptyState
                icon={Sparkles}
                title="What are you eating today?"
                description="Set your budget, time, and mood above to get Cook, Order, and Dineout recommendations."
              />
            </div>
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

        <ScrollReveal delay={0.5}>
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Budget this month</h2>
            </div>
            {budget ? (
              <div className="md:max-w-md">
                <BudgetOverview
                  monthlyBudget={budget.monthlyBudget}
                  spent={budget.spent}
                  bySource={budget.bySource}
                />
              </div>
            ) : (
              <div className="flex flex-col rounded-2xl border border-border bg-flour p-5 shadow-sm md:max-w-md">
                <Skeleton className="mb-4 h-6 w-1/2" />
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="mt-4 h-2 w-2/3" />
              </div>
            )}
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
