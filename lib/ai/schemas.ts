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

export const recommendationSchema = z.object({
  source: z.enum(["cook", "order", "dineout"]),
  title: z.string(),
  description: z.string(),
  cost: z.number(),
  timeMinutes: z.number(),
  effort: z.enum(["low", "medium", "high"]),
  imageUrl: z.string().optional(),
  items: z.array(z.object({ name: z.string(), quantity: z.string().optional(), price: z.number().optional() })),
  actionLabel: z.string(),
  providerData: z.any().default(null)
});

export type MealPlanItem = z.infer<typeof MealPlanItemSchema>;
export type MealPlanOutput = z.infer<typeof MealPlanSchema>;
