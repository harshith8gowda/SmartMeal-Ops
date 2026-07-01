import { getPrisma } from "./prisma";

export type NutritionLogInput = {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export async function getNutritionLogs(userId: string, startDate: Date, endDate: Date) {
  const prisma = getPrisma();
  return prisma.nutritionLog.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate }
    },
    orderBy: { date: "asc" }
  });
}

export async function upsertNutritionLog(userId: string, input: NutritionLogInput) {
  const prisma = getPrisma();
  const date = new Date(input.date);
  date.setHours(0, 0, 0, 0);

  const existing = await prisma.nutritionLog.findUnique({
    where: { userId_date: { userId, date } }
  });

  if (existing) {
    return prisma.nutritionLog.update({
      where: { id: existing.id },
      data: {
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        updatedAt: new Date()
      }
    });
  }

  return prisma.nutritionLog.create({
    data: {
      userId,
      date,
      calories: input.calories,
      protein: input.protein,
      carbs: input.carbs,
      fat: input.fat
    }
  });
}

export async function deleteNutritionLog(userId: string, id: string) {
  const prisma = getPrisma();
  return prisma.nutritionLog.deleteMany({
    where: { id, userId }
  });
}

export async function recalculateNutritionLogForDate(userId: string, date: Date) {
  const prisma = getPrisma();
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const slots = await prisma.mealSlot.findMany({
    where: {
      userId,
      date: { gte: start, lt: end }
    }
  });

  const totals = slots.reduce(
    (acc, slot) => {
      const items = slot.items as { nutrition?: { calories?: number; protein?: number; carbs?: number; fat?: number } } | null;
      const nutrition = items?.nutrition;
      acc.calories += nutrition?.calories ?? 0;
      acc.protein += nutrition?.protein ?? 0;
      acc.carbs += nutrition?.carbs ?? 0;
      acc.fat += nutrition?.fat ?? 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return upsertNutritionLog(userId, { date: start, ...totals });
}
