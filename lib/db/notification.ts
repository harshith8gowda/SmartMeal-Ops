import { getPrisma } from "./prisma";

export type NotificationInput = {
  title: string;
  body: string;
  type: string;
  actionUrl?: string;
};

export async function getNotifications(userId: string, limit: number = 50) {
  const prisma = getPrisma();
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit
  });
}

export async function getUnreadNotificationCount(userId: string) {
  const prisma = getPrisma();
  return prisma.notification.count({
    where: { userId, read: false }
  });
}

export async function createNotification(userId: string, input: NotificationInput) {
  const prisma = getPrisma();
  return prisma.notification.create({
    data: {
      userId,
      title: input.title,
      body: input.body,
      type: input.type,
      actionUrl: input.actionUrl
    }
  });
}

export async function markNotificationRead(userId: string, id: string) {
  const prisma = getPrisma();
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true, updatedAt: new Date() }
  });
}

export async function markAllNotificationsRead(userId: string) {
  const prisma = getPrisma();
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true, updatedAt: new Date() }
  });
}

export async function deleteNotification(userId: string, id: string) {
  const prisma = getPrisma();
  const result = await prisma.notification.deleteMany({
    where: { id, userId }
  });
  if (result.count === 0) throw new Error("Notification not found");
  return result;
}
