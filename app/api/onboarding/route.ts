import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { updatePreference } from "@/lib/db/preference";
import { createAddress } from "@/lib/db/address";
import { mapErrorToResponse } from "@/lib/errors";

const OnboardingSchema = z.object({
  name: z.string().min(2),
  householdSize: z.coerce.number().min(1).max(20),
  diet: z.array(z.string()).default([]),
  dietaryGoal: z.enum(["high_protein", "weight_loss", "low_carb", "balanced"]),
  monthlyBudgetInr: z.coerce.number().min(100),
  cookingSkill: z.enum(["low", "medium", "high"]),
  cuisines: z.string(),
  allergies: z.string(),
  address: z.object({
    label: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    pincode: z.string().min(1),
    lat: z.number().optional(),
    lng: z.number().optional()
  })
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureDbUser(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = OnboardingSchema.parse(body);

    await Promise.all([
      updatePreference(user.id, {
        diet: parsed.diet,
        dietaryGoal: parsed.dietaryGoal.toUpperCase() as "HIGH_PROTEIN" | "WEIGHT_LOSS" | "LOW_CARB" | "BALANCED",
        householdSize: parsed.householdSize,
        monthlyBudget: parsed.monthlyBudgetInr,
        cookingSkill: parsed.cookingSkill,
        cuisines: parsed.cuisines.split(",").map((s) => s.trim()).filter(Boolean),
        allergies: parsed.allergies.split(",").map((s) => s.trim()).filter(Boolean)
      }),
      createAddress(user.id, {
        ...parsed.address,
        isDefault: true
      })
    ]);

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
