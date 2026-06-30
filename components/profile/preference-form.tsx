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

export type Preference = {
  diet: string[];
  allergies: string[];
  cuisines: string[];
  householdSize: number;
  monthlyBudget: number;
  cookingSkill: string;
  dietaryGoal: string;
};

const preferenceSchema = z.object({
  diet: z.string(),
  allergies: z.string(),
  cuisines: z.string(),
  householdSize: z.coerce.number().min(1),
  monthlyBudgetInr: z.coerce.number().min(100),
  cookingSkill: z.enum(["low", "medium", "high"]),
  dietaryGoal: z.enum(["high_protein", "weight_loss", "low_carb", "balanced"])
});

type PreferenceFormData = z.infer<typeof preferenceSchema>;

const COOKING_SKILL_OPTIONS = [
  { value: "low", label: "Beginner" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "Expert" }
];

const DIETARY_GOAL_OPTIONS = [
  { value: "balanced", label: "Balanced" },
  { value: "high_protein", label: "High protein" },
  { value: "weight_loss", label: "Weight loss" },
  { value: "low_carb", label: "Low carb" }
];

export function PreferenceForm({ preference }: { preference?: Preference }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<PreferenceFormData>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      diet: preference?.diet.join(", ") || "",
      allergies: preference?.allergies.join(", ") || "",
      cuisines: preference?.cuisines.join(", ") || "",
      householdSize: preference?.householdSize || 2,
      monthlyBudgetInr: preference?.monthlyBudget || 500,
      cookingSkill: (preference?.cookingSkill as PreferenceFormData["cookingSkill"]) || "medium",
      dietaryGoal: (preference?.dietaryGoal?.toLowerCase() as PreferenceFormData["dietaryGoal"]) || "balanced"
    }
  });

  async function onSubmit(data: PreferenceFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          diet: data.diet.split(",").map((s) => s.trim()).filter(Boolean),
          allergies: data.allergies.split(",").map((s) => s.trim()).filter(Boolean),
          cuisines: data.cuisines.split(",").map((s) => s.trim()).filter(Boolean),
          householdSize: data.householdSize,
          monthlyBudgetInr: data.monthlyBudgetInr,
          cookingSkill: data.cookingSkill,
          dietaryGoal: data.dietaryGoal
        })
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      toast.success("Preferences updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update preferences");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <h2 className="font-display text-lg font-semibold">Dietary preferences</h2>
      <p className="text-sm text-muted-foreground">Personalize recommendations and budget defaults.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Diet (comma separated)</label>
            <Input placeholder="e.g. veg, high-protein" {...register("diet")} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Allergies</label>
            <Input placeholder="e.g. nuts, gluten" {...register("allergies")} />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Cuisines</label>
          <Input placeholder="e.g. north-indian, south-indian, italian" {...register("cuisines")} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-sm text-muted-foreground">Household size</label>
            <Input type="number" {...register("householdSize")} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Default budget (₹)</label>
            <Input type="number" {...register("monthlyBudgetInr")} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Cook skill</label>
            <select
              {...register("cookingSkill")}
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            >
              {COOKING_SKILL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
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
        <Button type="submit" disabled={loading} className="gap-2 sm:w-fit">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          Save preferences
        </Button>
      </form>
    </Card>
  );
}
