"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export type GoalPreference = {
  householdSize: number;
  monthlyBudget: number;
  dietaryGoal: string;
};

const goalSchema = z.object({
  householdSize: z.coerce.number().min(1),
  monthlyBudgetInr: z.coerce.number().min(100),
  dietaryGoal: z.enum(["high_protein", "weight_loss", "low_carb", "balanced"])
});

type GoalFormData = z.infer<typeof goalSchema>;

const DIETARY_GOAL_OPTIONS = [
  { value: "balanced", label: "Balanced" },
  { value: "high_protein", label: "High protein" },
  { value: "weight_loss", label: "Weight loss" },
  { value: "low_carb", label: "Low carb" }
];

export function GoalForm({ preference, onUpdate }: { preference?: GoalPreference; onUpdate?: () => void }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      householdSize: preference?.householdSize || 2,
      monthlyBudgetInr: preference?.monthlyBudget || 500,
      dietaryGoal: (preference?.dietaryGoal?.toLowerCase() as GoalFormData["dietaryGoal"]) || "balanced"
    }
  });

  async function onSubmit(data: GoalFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          householdSize: data.householdSize,
          monthlyBudgetInr: data.monthlyBudgetInr,
          dietaryGoal: data.dietaryGoal
        })
      });
      if (!res.ok) throw new Error("Failed to update goals");
      toast.success("Goals updated");
      onUpdate?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update goals");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <h2 className="font-display text-lg font-semibold">Your goals</h2>
      <p className="text-sm text-muted-foreground">Adjust the targets MealMap uses to plan and budget.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-sm text-muted-foreground">Household size</label>
            <Input type="number" {...register("householdSize")} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Monthly budget (₹)</label>
            <Input type="number" {...register("monthlyBudgetInr")} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Dietary goal</label>
            <select
              {...register("dietaryGoal")}
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            >
              {DIETARY_GOAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="gap-2 sm:w-fit">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          Save goals
        </Button>
      </form>
    </Card>
  );
}
