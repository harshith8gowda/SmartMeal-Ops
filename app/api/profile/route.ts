import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getPreference, updatePreference } from "@/lib/db/preference";
import { getAddresses } from "@/lib/db/address";
import { updateUserProfile } from "@/lib/db/user";
import { mapErrorToResponse } from "@/lib/errors";

const ProfileSchema = z.object({
  name: z.string().min(2).optional(),
  householdSize: z.coerce.number().min(1).max(20).optional(),
  diet: z.array(z.string()).optional(),
  dietaryGoal: z.enum(["high_protein", "weight_loss", "low_carb", "balanced"]).optional(),
  monthlyBudgetInr: z.coerce.number().min(100).optional(),
  cookingSkill: z.enum(["low", "medium", "high"]).optional(),
  cuisines: z.union([z.array(z.string()), z.string()]).optional(),
  allergies: z.union([z.array(z.string()), z.string()]).optional()
});

function normalizeStringList(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureDbUser(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [preference, addresses] = await Promise.all([
      getPreference(user.id),
      getAddresses(user.id)
    ]);

    return NextResponse.json({
      user: {
        id: user.id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      },
      preference,
      addresses
    });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

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
    const parsed = ProfileSchema.parse(body);

    if (parsed.name) {
      await updateUserProfile(user.id, { name: parsed.name });
    }

    const preferenceUpdate: Parameters<typeof updatePreference>[1] = {};
    if (parsed.householdSize !== undefined) preferenceUpdate.householdSize = parsed.householdSize;
    if (parsed.diet !== undefined) preferenceUpdate.diet = parsed.diet;
    if (parsed.dietaryGoal !== undefined) preferenceUpdate.dietaryGoal = parsed.dietaryGoal.toUpperCase() as "HIGH_PROTEIN" | "WEIGHT_LOSS" | "LOW_CARB" | "BALANCED";
    if (parsed.monthlyBudgetInr !== undefined) preferenceUpdate.monthlyBudget = parsed.monthlyBudgetInr;
    if (parsed.cookingSkill !== undefined) preferenceUpdate.cookingSkill = parsed.cookingSkill;
    if (parsed.cuisines !== undefined) preferenceUpdate.cuisines = normalizeStringList(parsed.cuisines);
    if (parsed.allergies !== undefined) preferenceUpdate.allergies = normalizeStringList(parsed.allergies);

    const preference = await updatePreference(user.id, preferenceUpdate);
    return NextResponse.json({ ok: true, preference });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
