"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, X, ShoppingBag, CalendarDays, Check } from "lucide-react";
import type { ComparisonRecommendation } from "./comparison-card-v2";
import { toast } from "sonner";
import Link from "next/link";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;

type MealType = (typeof MEAL_TYPES)[number];

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function CartSummary({
  recommendation,
  onClose
}: {
  recommendation: ComparisonRecommendation;
  onClose: () => void;
}) {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [planOpen, setPlanOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>("dinner");
  const [date, setDate] = useState<string>(() => getNext7Days()[0].toISOString());
  const [planning, setPlanning] = useState(false);
  const [planned, setPlanned] = useState(false);

  async function buildCart() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recommendation })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not build cart");
      setRedirectUrl(data.redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function addToPlan() {
    setPlanning(true);
    try {
      const slot = {
        date,
        mealType,
        source: recommendation.source.toUpperCase(),
        title: recommendation.title,
        description: recommendation.description,
        cost: recommendation.cost,
        timeMinutes: recommendation.timeMinutes,
        effort: recommendation.effort,
        items: {
          ingredients: recommendation.items.map((item) => item.name),
          providerSuggestion: recommendation.actionLabel
        }
      };
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slots: [slot] })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add to plan");
      setPlanned(true);
      toast.success("Added to meal plan");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add to plan");
    } finally {
      setPlanning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground opacity-30 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-flour p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <h3 className="font-display text-xl font-semibold">{recommendation.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p>

        <ul className="mt-5 space-y-2">
          {recommendation.items.map((item, i) => (
            <li key={`${item.name}-${i}`} className="flex items-center justify-between text-sm">
              <span>{item.name}</span>
              <span className="text-muted-foreground">{item.price ? `₹${item.price}` : item.quantity || ""}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">Total estimated</span>
          <span className="font-semibold">₹{recommendation.cost}</span>
        </div>

        {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}

        {!planOpen ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={buildCart} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Building..." : "Build in Swiggy"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setPlanOpen(true)}
              className="col-span-2 gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              Add to meal plan
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {planned ? (
              <div className="rounded-xl border border-cook/20 bg-cook-light p-4 text-center">
                <Check className="mx-auto h-5 w-5 text-cook" />
                <p className="mt-1 text-sm font-medium text-cook">Added to your meal plan</p>
                <Link
                  href="/meal-plan"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  onClick={onClose}
                >
                  View plan <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Meal</label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as MealType)}
                      className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                    >
                      {MEAL_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Day</label>
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                    >
                      {getNext7Days().map((d) => (
                        <option key={d.toISOString()} value={d.toISOString()}>
                          {formatDayLabel(d)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setPlanOpen(false)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={addToPlan} disabled={planning} className="flex-1 gap-2">
                    {planning && <Loader2 className="h-4 w-4 animate-spin" />}
                    Add to plan
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {redirectUrl && !planOpen && (
          <a
            href={redirectUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-center text-sm font-medium text-primary hover:underline"
          >
            Open in Swiggy <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
