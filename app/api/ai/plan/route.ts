import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { getPrisma } from "@/lib/db/prisma";
import { getPantryItems } from "@/lib/db/pantry";
import { getMonthlySpend } from "@/lib/db/orders";
import { createMealPlans } from "@/lib/db/meal-plan";
import { appendMessage } from "@/lib/db/conversation";
import { generateMealPlan, getMissingIngredients } from "@/lib/ai/planner";
import { buildTonightRecommendation } from "@/lib/ai/decision-engine";
import { searchFood } from "@/lib/swiggy/food";
import { searchGroceries } from "@/lib/swiggy/instamart";
import { searchRestaurants } from "@/lib/swiggy/dineout";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { mapErrorToResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const PlanInputSchema = z.object({
  prompt: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    await rateLimit(`plan:${userId}`, 10, 60);
    const prisma = getPrisma();

    const body = await req.json();
    const { prompt } = PlanInputSchema.parse(body);

    const [user, pantryItems] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      getPantryItems(userId)
    ]);

    if (!user) {
      return NextResponse.json({ error: "Profile not found. Complete onboarding first." }, { status: 404 });
    }

    const monthlySpend = await getMonthlySpend(userId);
    const budgetRemaining = Math.max(0, user.monthlyBudget - monthlySpend.total);
    const pantry = pantryItems.map((p) => p.item);
    const normalizedPrompt = prompt.toLowerCase();

    const meals = await generateMealPlan(prompt, {
      householdSize: user.householdSize,
      monthlyBudget: user.monthlyBudget,
      budgetRemaining,
      dietType: user.dietType,
      dietaryGoal: user.dietaryGoal.toLowerCase(),
      cookingSkill: user.cookingSkill,
      cuisines: user.cuisines,
      allergies: user.allergies,
      city: user.city,
      pantry
    });

    const missingIngredients = getMissingIngredients(meals, pantry);

    const recommendation = buildTonightRecommendation({
      budgetLeft: budgetRemaining,
      timeAvailableMins: normalizedPrompt.includes("book") || normalizedPrompt.includes("dine") ? 90 : 30,
      energyLevel: normalizedPrompt.includes("tired") ? "low" : "medium",
      missingIngredientsCount: normalizedPrompt.includes("book") || normalizedPrompt.includes("dine") ? 8 : missingIngredients.length,
      householdSize: normalizedPrompt.includes("for 4") ? 4 : user.householdSize || 2,
      goal: prompt,
      perMealBudget: 700
    });

    const addressId = user.preferences && typeof user.preferences === "object" && "defaultAddressId" in user.preferences
      ? String(user.preferences.defaultAddressId)
      : "addr_demo_home";

    const swiggyToken = await getSwiggyToken(userId);
    const [food, groceries, restaurants] = await Promise.all([
      searchFood("high protein dinner", addressId, swiggyToken),
      searchGroceries(missingIngredients[0] ?? "eggs", addressId, swiggyToken),
      searchRestaurants("dinner", addressId, swiggyToken)
    ]);

    await Promise.all([
      createMealPlans(
        meals.map((meal, index) => ({
          userId,
          date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
          type: "Dinner",
          title: meal.title,
          calories: meal.calories,
          protein: meal.protein,
          cost: meal.cost,
          source: meal.source,
          prepMinutes: meal.prepMinutes,
          ingredients: meal.ingredients ?? [],
          reason: meal.reason,
          providerSuggestion: meal.providerSuggestion
        }))
      ),
      appendMessage(userId, { role: "user", content: prompt, createdAt: new Date().toISOString() }),
      appendMessage(userId, {
        role: "assistant",
        content: `${recommendation.headline}. ${recommendation.reason}`,
        createdAt: new Date().toISOString()
      })
    ]);

    return NextResponse.json({
      summary: `${recommendation.headline}. ${recommendation.reason} I found ${missingIngredients.length} missing grocery items and prepared a confirmation-ready ${recommendation.source.toLowerCase()} path for "${prompt}".`,
      recommendation,
      meals,
      missingIngredients,
      swiggy: { food, groceries, restaurants }
    });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
