"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2),
  householdSize: z.coerce.number().min(1),
  dietType: z.string(),
  dietaryGoal: z.string(),
  monthlyBudgetInr: z.coerce.number().min(1000),
  cookingSkill: z.string(),
  cuisines: z.string(),
  allergies: z.string(),
  city: z.string().min(2)
});

type FormValues = z.infer<typeof schema>;

export function OnboardingForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dietType: "veg", dietaryGoal: "balanced", cookingSkill: "medium" }
  });

  const submit = async (values: FormValues) => {
    const res = await fetch("/api/profile", { method: "POST", body: JSON.stringify(values) });
    if (!res.ok) return toast.error("Could not save profile");
    toast.success("Profile saved. Smart recommendations unlocked.");
  };

  return (
    <Card className="glass max-w-2xl">
      <h2 className="text-2xl font-semibold">Set up SmartMeal Ops</h2>
      <form className="mt-5 grid gap-4" onSubmit={handleSubmit(submit)}>
        <Input placeholder="Name" {...register("name")} />
        <Input type="number" placeholder="Household size" {...register("householdSize")} />
        <Input placeholder="Diet type (veg/non-veg)" {...register("dietType")} />
        <Input placeholder="Diet goal (high_protein/weight_loss/low_carb/balanced)" {...register("dietaryGoal")} />
        <Input type="number" placeholder="Monthly budget INR" {...register("monthlyBudgetInr")} />
        <Input placeholder="Cooking skill (low/medium/high)" {...register("cookingSkill")} />
        <Input placeholder="Preferred cuisines (comma separated)" {...register("cuisines")} />
        <Textarea placeholder="Allergies (comma separated)" {...register("allergies")} />
        <Input placeholder="City" {...register("city")} />
        {Object.values(errors)[0] && <p className="text-sm text-red-600">Please fill all required fields correctly.</p>}
        <Button disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Preferences"}</Button>
      </form>
    </Card>
  );
}
