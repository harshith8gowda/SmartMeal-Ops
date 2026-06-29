import { Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

export type PreferenceInput = {
  diet?: string[];
  allergies?: string[];
  cuisines?: string[];
  householdSize?: number;
  monthlyBudget?: number;
  cookingSkill?: string;
  dietaryGoal?: "HIGH_PROTEIN" | "WEIGHT_LOSS" | "LOW_CARB" | "BALANCED";
};

export async function getPreference(userId: string) {
  const prisma = getPrisma();
  return prisma.preference.findUnique({
    where: { userId }
  });
}

export async function getOrCreatePreference(userId: string) {
  const prisma = getPrisma();
  const existing = await prisma.preference.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.preference.create({
    data: {
      userId,
      diet: [],
      allergies: [],
      cuisines: [],
      householdSize: 1,
      monthlyBudget: 500,
      cookingSkill: "medium",
      dietaryGoal: "BALANCED"
    }
  });
}

export async function updatePreference(userId: string, input: PreferenceInput) {
  const prisma = getPrisma();
  const data: Prisma.PreferenceUpdateInput = {};

  if (input.diet !== undefined) data.diet = input.diet;
  if (input.allergies !== undefined) data.allergies = input.allergies;
  if (input.cuisines !== undefined) data.cuisines = input.cuisines;
  if (input.householdSize !== undefined) data.householdSize = input.householdSize;
  if (input.monthlyBudget !== undefined) data.monthlyBudget = input.monthlyBudget;
  if (input.cookingSkill !== undefined) data.cookingSkill = input.cookingSkill;
  if (input.dietaryGoal !== undefined) data.dietaryGoal = input.dietaryGoal;

  return prisma.preference.upsert({
    where: { userId },
    create: {
      userId,
      diet: input.diet ?? [],
      allergies: input.allergies ?? [],
      cuisines: input.cuisines ?? [],
      householdSize: input.householdSize ?? 1,
      monthlyBudget: input.monthlyBudget ?? 500,
      cookingSkill: input.cookingSkill ?? "medium",
      dietaryGoal: input.dietaryGoal ?? "BALANCED"
    },
    update: data
  });
}

export async function deletePreference(userId: string) {
  const prisma = getPrisma();
  return prisma.preference.delete({
    where: { userId }
  });
}
