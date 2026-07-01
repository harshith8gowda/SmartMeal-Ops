"use client";

import { Card } from "@/components/ui/card";

type NutritionLog = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
}

export function NutritionChart({ logs, maxCalories = 2500 }: { logs: NutritionLog[]; maxCalories?: number }) {
  return (
    <Card className="p-5">
      <h3 className="font-display text-lg font-semibold">Calories this week</h3>
      <div className="mt-4 flex items-end justify-between gap-2">
        {logs.map((log) => {
          const height = Math.min(100, (log.calories / maxCalories) * 100);
          return (
            <div key={log.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full max-w-[40px]">
                <div
                  className="rounded-t-lg bg-primary"
                  style={{ height: `${height * 1.5}px`, minHeight: "4px" }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">{log.calories}</span>
              <span className="text-xs text-muted-foreground">{formatDayLabel(log.date)}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
