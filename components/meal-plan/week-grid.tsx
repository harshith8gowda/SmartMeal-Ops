"use client";

import { ChefHat, ShoppingBag, UtensilsCrossed } from "lucide-react";

export type MealSlot = {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  source: "cook" | "order" | "dineout" | null;
  title: string;
  cost: number;
  timeMinutes: number;
};

const sourceConfig = {
  cook: { icon: ChefHat, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  order: { icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  dineout: { icon: UtensilsCrossed, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
};

export function WeekGrid({
  slots,
  onSlotClick
}: {
  slots: MealSlot[];
  onSlotClick: (slot: MealSlot) => void;
}) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const mealTypes: MealSlot["mealType"][] = ["breakfast", "lunch", "dinner"];

  const getSlot = (date: Date, mealType: MealSlot["mealType"]) => {
    const iso = date.toISOString().split("T")[0];
    return slots.find((s) => s.date.startsWith(iso) && s.mealType === mealType);
  };

  return (
    <div className="grid gap-4 md:grid-cols-7">
      {days.map((day) => (
        <div key={day.toISOString()} className="space-y-3">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {day.toLocaleDateString("en-IN", { weekday: "short" })}
            </p>
            <p className="text-lg font-semibold">{day.getDate()}</p>
          </div>
          {mealTypes.map((mealType) => {
            const slot = getSlot(day, mealType);
            const config = slot?.source ? sourceConfig[slot.source] : null;
            const Icon = config?.icon;
            return (
              <button
                key={mealType}
                onClick={() =>
                  onSlotClick(
                    slot || {
                      id: "",
                      date: day.toISOString(),
                      mealType,
                      source: null,
                      title: "",
                      cost: 0,
                      timeMinutes: 0
                    }
                  )
                }
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  config
                    ? `${config.bg} ${config.border}`
                    : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">{mealType}</p>
                {slot ? (
                  <div className="mt-1">
                    <div className={`flex items-center gap-1.5 ${config?.color}`}>
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      <span className="text-xs font-medium capitalize">{slot.source}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm font-medium">{slot.title}</p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">+ Add</p>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
