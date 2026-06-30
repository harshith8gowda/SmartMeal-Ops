"use client";

import { Badge } from "@/components/ui/badge";
import { FoodMap } from "@/components/food-map/food-map";

type UserProfile = {
  name: string | null;
};

type Preference = {
  diet: string[];
  allergies: string[];
  cuisines: string[];
  dietaryGoal: string;
};

const DIETARY_GOAL_LABELS: Record<string, string> = {
  BALANCED: "Balanced",
  HIGH_PROTEIN: "High protein",
  WEIGHT_LOSS: "Weight loss",
  LOW_CARB: "Low carb"
};

function formatList(items: string[], limit = 2) {
  if (items.length === 0) return null;
  const visible = items.slice(0, limit);
  const remaining = items.length - limit;
  if (remaining > 0) {
    return `${visible.join(", ")} +${remaining}`;
  }
  return visible.join(", ");
}

export function DashboardHeaderV2({ user, preference }: { user?: UserProfile; preference?: Preference | null }) {
  const firstName = user?.name?.split(" ")[0] || "there";
  const goalLabel = preference?.dietaryGoal ? DIETARY_GOAL_LABELS[preference.dietaryGoal.toUpperCase()] : null;

  const chips: string[] = [];
  if (goalLabel) chips.push(goalLabel);
  const diet = formatList(preference?.diet || []);
  if (diet) chips.push(diet);
  const allergies = formatList(preference?.allergies || []);
  if (allergies) chips.push(`No ${allergies}`);
  const cuisines = formatList(preference?.cuisines || []);
  if (cuisines) chips.push(cuisines);
  const visibleChips = chips.slice(0, 4);

  return (
    <section className="rounded-2xl border border-border bg-flour p-4 shadow-sm lg:p-6">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          What are you eating today{firstName !== "there" ? `, ${firstName}` : ""}?
        </h2>
        <p className="mt-1 text-muted-foreground">Type a craving, budget, or dietary goal below.</p>
        {visibleChips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleChips.map((chip, i) => (
              <Badge key={i} variant={i === 0 ? "default" : "outline"} className="capitalize">
                {chip}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <FoodMap />
    </section>
  );
}
