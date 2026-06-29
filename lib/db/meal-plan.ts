import { MealSource, Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

export type MealPlanInput = {
  userId: string;
  date: Date;
  type: string;
  title: string;
  calories: number;
  protein: number;
  cost: number;
  source: MealSource;
  prepMinutes: number;
  ingredients: string[];
  reason?: string | null;
  providerSuggestion?: string | null;
};

function mapSlotToMealPlan(slot: {
  id: string;
  userId: string;
  date: Date;
  mealType: string;
  source: MealSource;
  title: string;
  description: string | null;
  cost: number;
  timeMinutes: number;
  effort: string | null;
  imageUrl: string | null;
  items: Prisma.JsonValue;
  cartSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): MealPlanInput {
  const items =
    slot.items && typeof slot.items === "object" && !Array.isArray(slot.items)
      ? (slot.items as Record<string, unknown>)
      : {};

  return {
    userId: slot.userId,
    date: slot.date,
    type: slot.mealType,
    title: slot.title,
    calories: 0,
    protein: 0,
    cost: slot.cost,
    source: slot.source,
    prepMinutes: slot.timeMinutes,
    ingredients: Array.isArray(items.ingredients) ? (items.ingredients as string[]) : [],
    reason: slot.description,
    providerSuggestion: typeof items.providerSuggestion === "string" ? items.providerSuggestion : null
  };
}

export async function getMealPlans(userId: string, limit = 10) {
  const prisma = getPrisma();
  const slots = await prisma.mealSlot.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit
  });
  return slots.map((slot) => mapSlotToMealPlan(slot));
}

export async function createMealPlan(input: MealPlanInput) {
  const prisma = getPrisma();
  const slot = await prisma.mealSlot.create({
    data: {
      userId: input.userId,
      date: input.date,
      mealType: input.type.toLowerCase(),
      source: input.source,
      title: input.title,
      description: input.reason ?? null,
      cost: input.cost,
      timeMinutes: input.prepMinutes,
      items: {
        ingredients: input.ingredients,
        providerSuggestion: input.providerSuggestion
      } as Prisma.InputJsonValue
    }
  });
  return mapSlotToMealPlan(slot);
}

export async function createMealPlans(inputs: MealPlanInput[]) {
  const prisma = getPrisma();
  await prisma.mealSlot.createMany({
    data: inputs.map((input) => ({
      userId: input.userId,
      date: input.date,
      mealType: input.type.toLowerCase(),
      source: input.source,
      title: input.title,
      description: input.reason ?? null,
      cost: input.cost,
      timeMinutes: input.prepMinutes,
      items: {
        ingredients: input.ingredients,
        providerSuggestion: input.providerSuggestion
      } as Prisma.InputJsonValue
    }))
  });
  return inputs;
}

export async function deleteMealPlan(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.mealSlot.deleteMany({
    where: { id, userId }
  });
}

export async function sumMealPlanCostThisMonth(userId: string) {
  const prisma = getPrisma();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await prisma.mealSlot.aggregate({
    where: {
      userId,
      date: { gte: startOfMonth }
    },
    _sum: {
      cost: true
    }
  });

  return result._sum.cost ?? 0;
}
