import { Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

export type CartSessionInput = {
  source: "COOK" | "ORDER" | "DINEOUT";
  redirectUrl: string;
  payload: unknown;
  status?: string;
};

export async function getCartSessions(userId: string, limit = 50) {
  const prisma = getPrisma();
  return prisma.cartSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit
  });
}

export async function getCartSessionById(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.cartSession.findFirst({
    where: { id, userId }
  });
}

export async function createCartSession(userId: string, input: CartSessionInput) {
  const prisma = getPrisma();
  return prisma.cartSession.create({
    data: {
      userId,
      source: input.source,
      redirectUrl: input.redirectUrl,
      payload: input.payload as Prisma.InputJsonValue,
      status: input.status ?? "ready"
    }
  });
}

export async function updateCartSessionStatus(id: string, userId: string, status: string) {
  const prisma = getPrisma();
  return prisma.cartSession.updateMany({
    where: { id, userId },
    data: { status }
  });
}

export async function deleteCartSession(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.cartSession.deleteMany({
    where: { id, userId }
  });
}
