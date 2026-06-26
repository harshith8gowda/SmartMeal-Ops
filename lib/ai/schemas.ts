import { z } from "zod";

export const MealPlanItemSchema = z.object({
  day: z.string(),
  title: z.string(),
  calories: z.number().int().min(0),
  protein: z.number().min(0),
  cost: z.number().int().min(0),
  prepMinutes: z.number().int().min(0),
  source: z.enum(["COOK", "ORDER", "DINEOUT"]),
  ingredients: z.array(z.string()).default([]),
  reason: z.string().optional(),
  providerSuggestion: z.string().optional()
});

export const MealPlanSchema = z.object({
  days: z.array(MealPlanItemSchema).min(1).max(7)
});

export type MealPlanItem = z.infer<typeof MealPlanItemSchema>;
export type MealPlanOutput = z.infer<typeof MealPlanSchema>;
