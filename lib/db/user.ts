import { getPrisma } from "./prisma";

export type UserWithPreferences = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  swiggyAccessToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  householdSize: number;
  monthlyBudget: number;
  dietType: string;
  dietaryGoal: string;
  cookingSkill: string;
  cuisines: string[];
  allergies: string[];
  city: string;
  preferences: Record<string, unknown> | null;
};

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
    avatarUrl?: string;
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

export async function getUserWithPreferences(userId: string): Promise<UserWithPreferences | null> {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preference: true, addresses: { where: { isDefault: true }, take: 1 } }
  });

  if (!user) return null;

  const preference = user.preference;
  const defaultAddress = user.addresses[0];

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    swiggyAccessToken: user.swiggyAccessToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    householdSize: preference?.householdSize ?? 2,
    monthlyBudget: preference?.monthlyBudget ?? 500,
    dietType: preference?.diet?.[0] ?? "non-veg",
    dietaryGoal: preference?.dietaryGoal ?? "BALANCED",
    cookingSkill: preference?.cookingSkill ?? "medium",
    cuisines: preference?.cuisines ?? [],
    allergies: preference?.allergies ?? [],
    city: defaultAddress?.city ?? "Bengaluru",
    preferences: null
  };
}
