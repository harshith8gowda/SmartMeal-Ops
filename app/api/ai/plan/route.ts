import { NextRequest, NextResponse } from "next/server";
import { buildTonightRecommendation } from "@/lib/ai/decision-engine";
import { generateMealPlan, getMissingIngredients } from "@/lib/ai/planner";
import { searchFood } from "@/lib/swiggy/food";
import { searchGroceries } from "@/lib/swiggy/instamart";
import { searchRestaurants } from "@/lib/swiggy/dineout";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const meals = await generateMealPlan(prompt ?? "");
  const missingIngredients = getMissingIngredients(meals, ["Rice", "Milk", "Bread"]);
  const recommendation = buildTonightRecommendation({
    budgetLeft: 2500,
    timeAvailableMins: 30,
    energyLevel: "low",
    missingIngredientsCount: missingIngredients.length,
    householdSize: 2,
    goal: prompt ?? "",
    perMealBudget: 700
  });
  const [food, groceries, restaurants] = await Promise.all([
    searchFood("high protein dinner", "Bengaluru"),
    searchGroceries(missingIngredients[0] ?? "eggs", "Bengaluru"),
    searchRestaurants("dinner", "Bengaluru")
  ]);

  return NextResponse.json({
    summary: `${recommendation.headline}. ${recommendation.reason} I found ${missingIngredients.length} missing grocery items and prepared a confirmation-ready ${recommendation.source.toLowerCase()} path for "${prompt}".`,
    recommendation,
    meals,
    missingIngredients,
    swiggy: { food, groceries, restaurants }
  });
}
