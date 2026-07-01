import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getPantryItems } from "@/lib/db/pantry";
import { getMonthlySpend } from "@/lib/db/orders";
import { bulkCreateMealSlots } from "@/lib/db/meal-slot";
import { createRecipe } from "@/lib/db/recipe";
import { createNotification } from "@/lib/db/notification";
import { getPreference } from "@/lib/db/preference";
import { getAddresses } from "@/lib/db/address";
import { appendMessage } from "@/lib/db/conversation";
import { generateMealPlan, getMissingIngredients } from "@/lib/ai/planner";
import { buildTonightRecommendation } from "@/lib/ai/decision-engine";
import { searchFood } from "@/lib/swiggy/food";
import { searchGroceries } from "@/lib/swiggy/instamart";
import { searchRestaurants } from "@/lib/swiggy/dineout";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { mapErrorToResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

const PlanInputSchema = z.object({
  prompt: z.string().min(1),
  startDate: z.string().datetime().optional()
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await rateLimit(`plan:${userId}`, 10, 60);

    const user = await ensureDbUser(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, startDate: startDateInput } = PlanInputSchema.parse(body);
    const startDate = startDateInput ? new Date(startDateInput) : new Date();

    const [preference, pantryItems, addresses] = await Promise.all([
      getPreference(user.id),
      getPantryItems(user.id),
      getAddresses(user.id)
    ]);

    const monthlySpend = await getMonthlySpend(user.id);
    const monthlyBudget = preference?.monthlyBudget ?? 500;
    const budgetRemaining = Math.max(0, monthlyBudget - monthlySpend.total);
    const pantry = pantryItems.map((p) => p.item);
    const normalizedPrompt = prompt.toLowerCase();
    const address = addresses.find((a) => a.isDefault) || addresses[0];
    const addressId = address?.id ?? "addr_demo_home";

    const meals = await generateMealPlan(prompt, {
      householdSize: preference?.householdSize ?? 2,
      monthlyBudget,
      budgetRemaining,
      dietType: preference?.diet?.[0] ?? "non-veg",
      dietaryGoal: (preference?.dietaryGoal ?? "BALANCED").toLowerCase(),
      cookingSkill: preference?.cookingSkill ?? "medium",
      cuisines: preference?.cuisines ?? [],
      allergies: preference?.allergies ?? [],
      city: address?.city ?? "Bengaluru",
      pantry
    });

    const missingIngredients = getMissingIngredients(meals, pantry);

    const recommendation = buildTonightRecommendation({
      budgetLeft: budgetRemaining,
      timeAvailableMins: normalizedPrompt.includes("book") || normalizedPrompt.includes("dine") ? 90 : 30,
      energyLevel: normalizedPrompt.includes("tired") ? "low" : "medium",
      missingIngredientsCount: normalizedPrompt.includes("book") || normalizedPrompt.includes("dine") ? 8 : missingIngredients.length,
      householdSize: normalizedPrompt.includes("for 4") ? 4 : (preference?.householdSize || 2),
      goal: prompt,
      perMealBudget: 700
    });

    const swiggyToken = await getSwiggyToken(user.id);
    const [food, groceries, restaurants] = await Promise.all([
      searchFood("high protein dinner", addressId, swiggyToken).catch(() => null),
      missingIngredients.length > 0
        ? searchGroceries(missingIngredients[0], addressId, swiggyToken).catch(() => null)
        : null,
      searchRestaurants("dinner", addressId, swiggyToken).catch(() => null)
    ]);

    try {
      await Promise.all([
        bulkCreateMealSlots(
          user.id,
          meals.map((meal, index) => ({
            date: new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000),
            mealType: "dinner",
            source: meal.source,
            title: meal.title,
            description: meal.reason,
            cost: meal.cost,
            timeMinutes: meal.prepMinutes,
            items: {
              ingredients: meal.ingredients ?? [],
              providerSuggestion: meal.providerSuggestion,
              nutrition: {
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat
              }
            } as Prisma.InputJsonValue
          }))
        ),
        ...meals
          .filter((meal) => meal.source === "COOK")
          .map((meal) =>
            createRecipe(user.id, {
              title: meal.title,
              description: meal.reason,
              source: meal.source,
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              ingredients: meal.ingredients ?? [],
              steps: [],
              cookTimeMinutes: meal.prepMinutes,
              cost: meal.cost
            })
          ),
        createNotification(user.id, {
          title: "AI meal plan ready",
          body: `${meals.length} dinners planned for the week.`,
          type: "ai_plan",
          actionUrl: "/meal-plan"
        }),
        appendMessage(user.id, { role: "user", content: prompt, createdAt: new Date().toISOString() }),
        appendMessage(user.id, {
          role: "assistant",
          content: `${recommendation.headline}. ${recommendation.reason}`,
          createdAt: new Date().toISOString()
        })
      ]);
    } catch (sideEffectError) {
      console.error("AI plan side effects failed:", sideEffectError);
    }

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
