"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { WeekGrid, type MealSlot } from "@/components/meal-plan/week-grid";
import { SlotSheet, type SlotFormData } from "@/components/meal-plan/slot-sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Sparkles, Trash2, ExternalLink, CalendarDays } from "lucide-react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { EmptyState } from "@/components/ui/empty-state";

export default function MealPlanPage() {
  const [slots, setSlots] = useState<MealSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlot, setActiveSlot] = useState<MealSlot | null>(null);
  const [building, setBuilding] = useState(false);
  const [aiPlanning, setAiPlanning] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString()
    });
    try {
      const res = await fetch(`/api/meal-plan?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load plan");
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load plan");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(data: SlotFormData) {
    const existingItems = (activeSlot?.items as Record<string, unknown> | null) ?? {};
    const slot = {
      ...data,
      items: {
        ...existingItems,
        nutrition: {
          calories: data.calories ?? 0,
          protein: data.protein ?? 0,
          carbs: data.carbs ?? 0,
          fat: data.fat ?? 0
        }
      }
    };
    const res = await fetch("/api/meal-plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slots: [slot] })
    });
    if (!res.ok) {
      toast.error("Could not save slot");
      return;
    }
    toast.success("Slot saved");
    setActiveSlot(null);
    await fetchSlots();
  }

  async function handleDelete() {
    if (!activeSlot?.id) return;
    const res = await fetch("/api/meal-plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "delete", id: activeSlot.id })
    });
    if (!res.ok) {
      toast.error("Could not delete slot");
      return;
    }
    toast.success("Slot deleted");
    setActiveSlot(null);
    await fetchSlots();
  }

  async function handleClear() {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const res = await fetch("/api/meal-plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "clear", start: start.toISOString(), end: end.toISOString() })
    });
    if (!res.ok) {
      toast.error("Could not clear plan");
      return;
    }
    toast.success("Plan cleared");
    await fetchSlots();
  }

  async function handleAiPlan() {
    setAiPlanning(true);
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: "Plan my week", startDate: start.toISOString() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI planning failed");
      toast.success(data.slots?.length ? "AI plan generated" : "AI plan generated (mock)");
      await fetchSlots();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI planning failed");
    } finally {
      setAiPlanning(false);
    }
  }

  async function handleBuildAll() {
    setBuilding(true);
    try {
      const filledSlots = slots.filter((s) => s.source && s.title);
      for (const slot of filledSlots) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            recommendation: {
              source: slot.source,
              title: slot.title,
              description: "",
              cost: slot.cost,
              timeMinutes: slot.timeMinutes,
              effort: "medium",
              items: [{ name: slot.title }],
              actionLabel: "Open in Swiggy"
            }
          })
        });
      }
      toast.success(`Built ${filledSlots.length} carts`);
    } finally {
      setBuilding(false);
    }
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ScrollReveal>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
                <Sparkles className="h-4 w-4" /> Weekly plan
              </p>
              <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Meal planner</h1>
              <p className="mt-2 text-muted-foreground">
                Plan 7 days of breakfast, lunch, and dinner. Tap any slot to choose cook, order, or dineout.
              </p>
            </div>
          </ScrollReveal>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleAiPlan} disabled={aiPlanning} className="gap-2">
              {aiPlanning && <Loader2 className="h-4 w-4 animate-spin" />}
              <Sparkles className="h-4 w-4" />
              AI plan
            </Button>
            <Button variant="secondary" onClick={handleBuildAll} disabled={building} className="gap-2">
              {building && <Loader2 className="h-4 w-4 animate-spin" />}
              <ExternalLink className="h-4 w-4" />
              Build all carts
            </Button>
            <Button variant="outline" onClick={handleClear} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading plan...</div>
        ) : slots.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No meals planned yet"
            description="Tap any slot to add a meal, or use AI plan to fill the week."
            action="AI plan"
            onAction={handleAiPlan}
          />
        ) : (
          <WeekGrid slots={slots} onSlotClick={setActiveSlot} />
        )}

        {activeSlot && (
          <SlotSheet
            slot={activeSlot}
            onClose={() => setActiveSlot(null)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}
      </main>
    </>
  );
}
