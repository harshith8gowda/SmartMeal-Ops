import { NextRequest, NextResponse } from "next/server";
import { buildTonightRecommendation } from "@/lib/ai/decision-engine";
import { generateMealPlan, getMissingIngredients } from "@/lib/ai/planner";
import { searchFood } from "@/lib/swiggy/food";
import { searchGroceries } from "@/lib/swiggy/instamart";
import { searchRestaurants } from "@/lib/swiggy/dineout";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const normalizedPrompt = String(prompt ?? "").toLowerCase();
  const meals = await generateMealPlan(prompt ?? "");
  const missingIngredients = getMissingIngredients(meals, ["Rice", "Milk", "Bread"]);
  const addressId = process.env.SWIGGY_DEFAULT_ADDRESS_ID ?? "addr_demo_home";
  const recommendation = buildTonightRecommendation({
    budgetLeft: 2500,
    timeAvailableMins: normalizedPrompt.includes("book") || normalizedPrompt.includes("dine") ? 90 : 30,
    energyLevel: normalizedPrompt.includes("tired") ? "low" : "medium",
    missingIngredientsCount: normalizedPrompt.includes("book") || normalizedPrompt.includes("dine") ? 8 : missingIngredients.length,
    householdSize: normalizedPrompt.includes("for 4") ? 4 : 2,
    goal: prompt ?? "",
    perMealBudget: 700
  });
  const [food, groceries, restaurants] = await Promise.all([
    searchFood("high protein dinner", addressId),
    searchGroceries(missingIngredients[0] ?? "eggs", addressId),
    searchRestaurants("dinner", addressId)
  ]);

  return NextResponse.json({
    summary: `${recommendation.headline}. ${recommendation.reason} I found ${missingIngredients.length} missing grocery items and prepared a confirmation-ready ${recommendation.source.toLowerCase()} path for "${prompt}".`,
    recommendation,
    meals,
    missingIngredients,
    swiggy: { food, groceries, restaurants }
  });
}
