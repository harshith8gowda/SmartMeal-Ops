import { DietGoal } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

function parseDietGoal(value: string): DietGoal {
  const normalized = value?.toUpperCase?.() ?? "BALANCED";
  if (normalized === "HIGH_PROTEIN") return DietGoal.HIGH_PROTEIN;
  if (normalized === "WEIGHT_LOSS") return DietGoal.WEIGHT_LOSS;
  if (normalized === "LOW_CARB") return DietGoal.LOW_CARB;
  return DietGoal.BALANCED;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const dietaryGoal = parseDietGoal(String(body.dietaryGoal || "balanced"));

  const payload = {
    name: body.name,
    householdSize: body.householdSize,
    dietType: body.dietType,
    dietaryGoal,
    monthlyBudget: body.monthlyBudgetInr,
    cookingSkill: body.cookingSkill,
    cuisines: String(body.cuisines || "").split(",").map((s: string) => s.trim()).filter(Boolean),
    allergies: String(body.allergies || "").split(",").map((s: string) => s.trim()).filter(Boolean),
    city: body.city,
    preferences: body
  };

  const user = await prisma.user.upsert({
    where: { email: "demo@smartmealops.ai" },
    update: payload,
    create: {
      email: "demo@smartmealops.ai",
      ...payload
    }
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
