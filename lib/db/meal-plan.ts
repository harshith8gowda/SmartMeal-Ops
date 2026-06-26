import { MealSource } from "@prisma/client";
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

export async function getMealPlans(userId: string, limit = 10) {
  const prisma = getPrisma();
  return prisma.mealPlan.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit
  });
}

export async function createMealPlan(input: MealPlanInput) {
  const prisma = getPrisma();
  return prisma.mealPlan.create({
    data: input
  });
}

export async function createMealPlans(inputs: MealPlanInput[]) {
  const prisma = getPrisma();
  return prisma.mealPlan.createMany({
    data: inputs
  });
}

export async function deleteMealPlan(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.mealPlan.deleteMany({
    where: { id, userId }
  });
}

export async function sumMealPlanCostThisMonth(userId: string) {
  const prisma = getPrisma();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await prisma.mealPlan.aggregate({
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
