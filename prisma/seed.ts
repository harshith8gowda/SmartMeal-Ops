import { DietGoal, MealSource, PrismaClient } from "@prisma/client";

const DEMO_CLERK_ID = "user_demo_000000000000000000000000";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@smartmealops.ai" },
    update: {},
    create: {
      clerkId: DEMO_CLERK_ID,
      name: "Demo User",
      email: "demo@smartmealops.ai",
      householdSize: 3,
      dietType: "non-veg",
      dietaryGoal: DietGoal.HIGH_PROTEIN,
      monthlyBudget: 12000,
      cookingSkill: "medium",
      cuisines: ["Indian", "Mediterranean"],
      allergies: ["Peanuts"],
      city: "Bengaluru",
      preferences: { energy: "medium" }
    }
  });

  await prisma.pantryItem.createMany({
    data: [
      { userId: user.id, item: "Eggs", qty: 6, unit: "pcs", recurring: true },
      { userId: user.id, item: "Milk", qty: 1, unit: "litre", recurring: true },
      { userId: user.id, item: "Rice", qty: 2, unit: "kg", recurring: true }
    ]
  });

  await prisma.mealPlan.create({
    data: {
      userId: user.id,
      date: new Date(),
      type: "Dinner",
      title: "Chicken Rice Bowl",
      calories: 610,
      protein: 41,
      cost: 320,
      prepMinutes: 35,
      source: MealSource.COOK,
      ingredients: ["Chicken breast", "Rice", "Curd", "Cucumber"],
      reason: "Best protein-to-cost ratio."
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
