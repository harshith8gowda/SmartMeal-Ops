import { NextRequest, NextResponse } from "next/server";
import { decideMealAction } from "@/lib/ai/decision-engine";
import { generateMealPlan } from "@/lib/ai/planner";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const meals = await generateMealPlan(prompt ?? "");
  const decision = decideMealAction({
    budgetLeft: 2500,
    timeAvailableMins: 30,
    energyLevel: "low",
    missingIngredientsCount: 3
  });

  return NextResponse.json({
    summary: `${decision.reason} Suggested plan generated for your request: \"${prompt}\".`,
    decision,
    meals
  });
}
