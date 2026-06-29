import { MealSource, OrderStatus } from "@prisma/client";
import { getPrisma } from "./prisma";

export type OrderHistoryInput = {
  userId: string;
  cartSessionId: string;
  source: MealSource;
  title: string;
  total: number;
  status?: OrderStatus;
  swiggyUrl?: string;
};

export type Order = {
  id: string;
  provider: string;
  source: MealSource;
  status: string;
  total: number;
  etaMinutes: number | null;
  createdAt: Date;
};

function mapToOrder(order: Awaited<ReturnType<typeof getOrderHistory>>[number]): Order {
  return {
    id: order.id,
    provider: order.source.toLowerCase(),
    source: order.source,
    status: order.status,
    total: order.total,
    etaMinutes: null,
    createdAt: order.createdAt
  };
}

export async function getOrderHistory(userId: string, limit = 50) {
  const prisma = getPrisma();
  return prisma.orderHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit
  });
}

export async function getOrders(userId: string, limit = 50): Promise<Order[]> {
  const history = await getOrderHistory(userId, limit);
  return history.map(mapToOrder);
}

export async function createOrderHistory(input: OrderHistoryInput) {
  const prisma = getPrisma();
  return prisma.orderHistory.create({
    data: {
      userId: input.userId,
      cartSessionId: input.cartSessionId,
      source: input.source,
      title: input.title,
      total: input.total,
      status: input.status ?? "PENDING",
      swiggyUrl: input.swiggyUrl
    }
  });
}

export async function updateOrderHistoryStatus(id: string, userId: string, status: OrderStatus) {
  const prisma = getPrisma();
  return prisma.orderHistory.updateMany({
    where: { id, userId },
    data: { status }
  });
}

export async function getMonthlySpend(userId: string) {
  const prisma = getPrisma();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const orders = await prisma.orderHistory.findMany({
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

  const total = orders.reduce((sum: number, o) => sum + o.total, 0);
  const bySource = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.source] = (acc[o.source] || 0) + o.total;
    return acc;
  }, {});

  return { total, bySource };
}
