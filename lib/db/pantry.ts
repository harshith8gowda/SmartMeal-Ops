import { getPrisma } from "./prisma";

export async function getPantryItems(userId: string) {
  const prisma = getPrisma();
  return prisma.pantryItem.findMany({
    where: { userId },
    orderBy: { item: "asc" }
  });
}

export async function createPantryItem(userId: string, item: string, qty: number, unit: string, recurring = false) {
  const prisma = getPrisma();
  return prisma.pantryItem.upsert({
    where: {
      userId_item: {
        userId,
        item
      }
    },
    update: {
      qty,
      unit,
      recurring
    },
    create: {
      userId,
      item,
      qty,
      unit,
      recurring
    }
  });
}

export async function updatePantryItem(id: string, userId: string, data: { qty?: number; unit?: string; recurring?: boolean }) {
  const prisma = getPrisma();
  return prisma.pantryItem.updateMany({
    where: { id, userId },
    data
  });
}

export async function deletePantryItem(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.pantryItem.deleteMany({
    where: { id, userId }
  });
}
