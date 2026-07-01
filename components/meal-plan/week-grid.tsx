"use client";

import { ChefHat, ShoppingBag, UtensilsCrossed } from "lucide-react";

export type MealSlot = {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  source: "COOK" | "ORDER" | "DINEOUT" | null;
  title: string;
  description?: string;
  cost: number;
  timeMinutes: number;
  effort?: string;
  items?: unknown;
};

const sourceConfig = {
  cook: { icon: ChefHat, color: "text-cook", bg: "bg-cook-light", border: "border-cook/20" },
  order: { icon: ShoppingBag, color: "text-order", bg: "bg-order-light", border: "border-order/20" },
  dineout: { icon: UtensilsCrossed, color: "text-dineout", bg: "bg-dineout-light", border: "border-dineout/20" }
};

function getSourceConfig(source: MealSlot["source"]) {
  const key = (source ?? "COOK").toLowerCase() as keyof typeof sourceConfig;
  return sourceConfig[key] ?? sourceConfig.cook;
}

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
    <div className="grid gap-3 sm:gap-4 md:grid-cols-7">
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className="h-full space-y-3 rounded-2xl border border-border bg-flour p-3 shadow-sm sm:p-4"
        >
          <div className="text-center">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {day.toLocaleDateString("en-IN", { weekday: "short" })}
            </p>
            <p className="text-lg font-semibold text-foreground">{day.getDate()}</p>
          </div>
          {mealTypes.map((mealType) => {
            const slot = getSlot(day, mealType);
            const config = slot?.source ? getSourceConfig(slot.source) : null;
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
                    : "border-border bg-porcelain/50 hover:bg-porcelain"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">{mealType}</p>
                {slot ? (
                  <div className="mt-1">
                    <div className={`flex items-center gap-1.5 ${config?.color}`}>
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      <span className="text-xs font-medium capitalize">{slot.source}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">{slot.title}</p>
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
