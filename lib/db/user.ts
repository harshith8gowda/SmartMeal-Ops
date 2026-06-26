import { Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

export async function findUserById(id: string) {
  const prisma = getPrisma();
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByClerkId(clerkId: string) {
  const prisma = getPrisma();
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function upsertUser(input: {
  id: string;
  clerkId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}) {
  const prisma = getPrisma();
  return prisma.user.upsert({
    where: { id: input.id },
    update: {
      email: input.email,
      name: input.name,
      avatarUrl: input.avatarUrl
    },
    create: {
      id: input.id,
      clerkId: input.clerkId,
      email: input.email,
      name: input.name,
      avatarUrl: input.avatarUrl
    }
  });
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    householdSize?: number;
    dietType?: string;
    dietaryGoal?: "HIGH_PROTEIN" | "WEIGHT_LOSS" | "LOW_CARB" | "BALANCED";
    monthlyBudget?: number;
    cookingSkill?: string;
    cuisines?: string[];
    allergies?: string[];
    city?: string;
    preferences?: Prisma.InputJsonValue;
  }
) {
  const prisma = getPrisma();
  return prisma.user.update({
    where: { id: userId },
    data
  });
}

export async function updateSwiggyToken(userId: string, encryptedToken: string | null) {
  const prisma = getPrisma();
  return prisma.user.update({
    where: { id: userId },
    data: { swiggyAccessToken: encryptedToken }
  });
}
