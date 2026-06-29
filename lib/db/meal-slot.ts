import { Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

export type MealSlotInput = {
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner";
  source: "COOK" | "ORDER" | "DINEOUT";
  title: string;
  description?: string;
  cost?: number;
  timeMinutes?: number;
  effort?: string;
  imageUrl?: string;
  items?: unknown;
  cartSessionId?: string;
};

export async function getMealSlots(userId: string, startDate: Date, endDate: Date) {
  const prisma = getPrisma();
  return prisma.mealSlot.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate }
    },
    orderBy: [{ date: "asc" }, { mealType: "asc" }]
  });
}

export async function getMealSlotById(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.mealSlot.findFirst({
    where: { id, userId }
  });
}

export async function createMealSlot(userId: string, input: MealSlotInput) {
  const prisma = getPrisma();
  return prisma.mealSlot.create({
    data: {
      userId,
      date: input.date,
      mealType: input.mealType,
      source: input.source,
      title: input.title,
      description: input.description,
      cost: input.cost ?? 0,
      timeMinutes: input.timeMinutes ?? 0,
      effort: input.effort,
      imageUrl: input.imageUrl,
      items: input.items ? (input.items as Prisma.InputJsonValue) : undefined,
      cartSessionId: input.cartSessionId
    }
  });
}

export async function updateMealSlot(id: string, userId: string, input: Partial<MealSlotInput>) {
  const prisma = getPrisma();
  const data: Prisma.MealSlotUncheckedUpdateManyInput = {};

  if (input.date !== undefined) data.date = input.date;
  if (input.mealType !== undefined) data.mealType = input.mealType;
  if (input.source !== undefined) data.source = input.source;
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.cost !== undefined) data.cost = input.cost;
  if (input.timeMinutes !== undefined) data.timeMinutes = input.timeMinutes;
  if (input.effort !== undefined) data.effort = input.effort;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
  if (input.items !== undefined) data.items = input.items as Prisma.InputJsonValue;
  if (input.cartSessionId !== undefined) data.cartSessionId = input.cartSessionId;

  return prisma.mealSlot.updateMany({
    where: { id, userId },
    data
  });
}

export async function deleteMealSlot(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.mealSlot.deleteMany({
    where: { id, userId }
  });
}

export async function clearMealSlots(userId: string, startDate: Date, endDate: Date) {
  const prisma = getPrisma();
  return prisma.mealSlot.deleteMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate }
    }
  });
}

export async function bulkCreateMealSlots(userId: string, slots: MealSlotInput[]) {
  const prisma = getPrisma();
  return prisma.mealSlot.createMany({
    data: slots.map((slot) => ({
      userId,
      date: slot.date,
      mealType: slot.mealType,
      source: slot.source,
      title: slot.title,
      description: slot.description ?? null,
      cost: slot.cost ?? 0,
      timeMinutes: slot.timeMinutes ?? 0,
      effort: slot.effort ?? null,
      imageUrl: slot.imageUrl ?? null,
      items: slot.items ? (slot.items as Prisma.InputJsonValue) : undefined,
      cartSessionId: slot.cartSessionId ?? null
    }))
  });
}

export async function sumMealSlotCostThisMonth(userId: string) {
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
