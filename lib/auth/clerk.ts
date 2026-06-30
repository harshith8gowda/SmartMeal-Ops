import { auth, currentUser } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db/prisma";

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl
  };
}

export async function ensureDbUser(userId: string) {
  const prisma = getPrisma();
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() || null;
  const avatarUrl = clerkUser.imageUrl ?? null;

  return prisma.user.upsert({
    where: { id: userId },
    update: { email, name, avatarUrl },
    create: {
      id: userId,
      clerkId: userId,
      email,
      name,
      avatarUrl
    }
  });
}

export async function getDbUser(userId: string) {
  const prisma = getPrisma();
  return prisma.user.findUnique({ where: { id: userId } });
}
