"use client";

import { Card } from "@/components/ui/card";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";

type NutritionLog = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric" });
}

export function NutritionSummary({ logs }: { logs: NutritionLog[] }) {
  const totals = logs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fat: acc.fat + log.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const avgCalories = logs.length ? Math.round(totals.calories / logs.length) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="h-4 w-4 text-primary" /> Avg calories
          </div>
          <p className="mt-1 font-display text-2xl font-semibold">{avgCalories}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Beef className="h-4 w-4 text-cook" /> Protein
          </div>
          <p className="mt-1 font-display text-2xl font-semibold">{Math.round(totals.protein)}g</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wheat className="h-4 w-4 text-accent" /> Carbs
          </div>
          <p className="mt-1 font-display text-2xl font-semibold">{Math.round(totals.carbs)}g</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Droplets className="h-4 w-4 text-dineout" /> Fat
          </div>
          <p className="mt-1 font-display text-2xl font-semibold">{Math.round(totals.fat)}g</p>
        </Card>
      </div>

      <div className="grid gap-4">
        {logs.map((log) => (
          <Card key={log.date} className="p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">{formatDayLabel(log.date)}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{log.calories} kcal</span>
                <span>{log.protein}g protein</span>
                <span>{log.carbs}g carbs</span>
                <span>{log.fat}g fat</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
