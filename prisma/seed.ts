import { DietGoal, MealSource, PrismaClient } from "@prisma/client";

const DEMO_CLERK_ID = "user_demo_000000000000000000000000";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@mealmap.ai" },
    update: {},
    create: {
      clerkId: DEMO_CLERK_ID,
      name: "Demo User",
      email: "demo@mealmap.ai"
    }
  });

  await prisma.preference.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      diet: ["non-veg"],
      allergies: ["Peanuts"],
      cuisines: ["Indian", "Mediterranean"],
      householdSize: 3,
      monthlyBudget: 12000,
      cookingSkill: "medium",
      dietaryGoal: DietGoal.HIGH_PROTEIN
    }
  });

  await prisma.address.upsert({
    where: {
      id: "addr_demo_home"
    },
    update: {},
    create: {
      userId: user.id,
      label: "Home",
      address: "Demo home address",
      city: "Bengaluru",
      pincode: "560001",
      isDefault: true
    }
  });

  await prisma.pantryItem.createMany({
    data: [
      { userId: user.id, item: "Eggs", qty: 6, unit: "pcs", recurring: true },
      { userId: user.id, item: "Milk", qty: 1, unit: "litre", recurring: true },
      { userId: user.id, item: "Rice", qty: 2, unit: "kg", recurring: true }
    ],
    skipDuplicates: true
  });

  await prisma.mealSlot.create({
    data: {
      userId: user.id,
      date: new Date(),
      mealType: "dinner",
      source: MealSource.COOK,
      title: "Chicken Rice Bowl",
      description: "Best protein-to-cost ratio.",
      cost: 320,
      timeMinutes: 35
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
