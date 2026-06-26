import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { requireUserId, getCurrentUser } from "@/lib/auth/clerk";

const ProfileSchema = z.object({
  name: z.string().min(2),
  householdSize: z.coerce.number().min(1).max(20),
  dietType: z.enum(["veg", "non-veg", "eggetarian"]),
  dietaryGoal: z.enum(["high_protein", "weight_loss", "low_carb", "balanced"]),
  monthlyBudgetInr: z.coerce.number().min(1000),
  cookingSkill: z.enum(["low", "medium", "high"]),
  cuisines: z.string(),
  allergies: z.string(),
  city: z.string().min(2)
});

const prismaToClient = (user: Awaited<ReturnType<ReturnType<typeof getPrisma>["user"]["findUnique"]>>) => {
  if (!user) return null;
  return {
    id: user.id,
    clerkId: user.clerkId,
    name: user.name,
    email: user.email,
    householdSize: user.householdSize,
    dietType: user.dietType,
    dietaryGoal: user.dietaryGoal,
    monthlyBudgetInr: user.monthlyBudget,
    cookingSkill: user.cookingSkill,
    cuisines: user.cuisines,
    allergies: user.allergies,
    city: user.city,
    preferences: user.preferences
  };
};

export async function GET() {
  try {
    const userId = await requireUserId();
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return NextResponse.json(prismaToClient(user));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const clerkUser = await getCurrentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ProfileSchema.parse(body);

    const prisma = getPrisma();
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: parsed.name,
        householdSize: parsed.householdSize,
        dietType: parsed.dietType,
        dietaryGoal: parsed.dietaryGoal.toUpperCase() as "HIGH_PROTEIN" | "WEIGHT_LOSS" | "LOW_CARB" | "BALANCED",
        monthlyBudget: parsed.monthlyBudgetInr,
        cookingSkill: parsed.cookingSkill,
        cuisines: parsed.cuisines.split(",").map((s) => s.trim()).filter(Boolean),
        allergies: parsed.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        city: parsed.city
      },
      create: {
        id: userId,
        clerkId: userId,
        email: clerkUser.email,
        name: parsed.name,
        householdSize: parsed.householdSize,
        dietType: parsed.dietType,
        dietaryGoal: parsed.dietaryGoal.toUpperCase() as "HIGH_PROTEIN" | "WEIGHT_LOSS" | "LOW_CARB" | "BALANCED",
        monthlyBudget: parsed.monthlyBudgetInr,
        cookingSkill: parsed.cookingSkill,
        cuisines: parsed.cuisines.split(",").map((s) => s.trim()).filter(Boolean),
        allergies: parsed.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        city: parsed.city
      }
    });

    return NextResponse.json({ ok: true, user: prismaToClient(user) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
