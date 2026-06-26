import { MealSource, OrderStatus, Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

export type OrderInput = {
  userId: string;
  provider: string;
  source: MealSource;
  status: OrderStatus;
  total: number;
  etaMinutes?: number | null;
  externalId?: string | null;
  payload?: Record<string, unknown>;
};

export async function getOrders(userId: string, limit = 50) {
  const prisma = getPrisma();
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit
  });
}

export async function createOrder(input: OrderInput) {
  const prisma = getPrisma();
  return prisma.order.create({
    data: {
      ...input,
      payload: input.payload ? (input.payload as unknown as Prisma.InputJsonValue) : undefined
    }
  });
}

export async function updateOrderStatus(id: string, userId: string, status: OrderStatus) {
  const prisma = getPrisma();
  return prisma.order.updateMany({
    where: { id, userId },
    data: { status }
  });
}

export async function getMonthlySpend(userId: string) {
  const prisma = getPrisma();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const orders = await prisma.order.findMany({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
      status: { not: OrderStatus.FAILED }
    },
    select: {
      source: true,
      total: true
    }
  });

  const total = orders.reduce((sum, o) => sum + o.total, 0);
  const bySource = orders.reduce((acc, o) => {
    acc[o.source] = (acc[o.source] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  return { total, bySource };
}
