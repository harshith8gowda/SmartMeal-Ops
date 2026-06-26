import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId, getCurrentUser } from "@/lib/auth/clerk";
import { getPrisma } from "@/lib/db/prisma";
import { mapErrorToResponse } from "@/lib/errors";

const OnboardingSchema = z.object({
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

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const clerkUser = await getCurrentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = OnboardingSchema.parse(body);

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

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
