import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { MealPlanCard } from "@/components/cards/meal-plan-card";
import { ConfirmationCard } from "@/components/cards/confirmation-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetOverview } from "@/components/charts/budget-overview";
import { AssistantPanel } from "@/components/chat/assistant-panel";
import { OrderList } from "@/components/orders/order-list";
import { PantryManager } from "@/components/pantry/pantry-manager";
import { getMissingIngredients, generateMealPlan } from "@/lib/ai/planner";
import { buildTonightRecommendation } from "@/lib/ai/decision-engine";
import { searchFood } from "@/lib/swiggy/food";
import { searchRestaurants } from "@/lib/swiggy/dineout";
import { getPrisma } from "@/lib/db/prisma";
import { getPantryItems } from "@/lib/db/pantry";
import { getMealPlans } from "@/lib/db/meal-plan";
import { getBudgetStatus } from "@/lib/db/budget";
import { getOrders } from "@/lib/db/orders";
import { UserButton } from "@clerk/nextjs";
import { ArrowRight, CalendarCheck, PackagePlus, ShoppingBag, Utensils } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in" as never);
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    redirect("/onboarding" as never);
  }

  const [pantryItems, mealPlans, budgetStatus, orders] = await Promise.all([
    getPantryItems(userId),
    getMealPlans(userId, 5),
    getBudgetStatus(userId, user.monthlyBudget),
    getOrders(userId, 5)
  ]);

  const pantry = pantryItems.map((p) => p.item);
  const meals = mealPlans.length
    ? mealPlans.map((m) => ({
        day: m.date.toLocaleDateString("en-IN", { weekday: "short" }),
        title: m.title,
        calories: m.calories,
        protein: m.protein,
        cost: m.cost,
        prepMinutes: m.prepMinutes,
        source: m.source,
        ingredients: m.ingredients,
        reason: m.reason ?? undefined,
        providerSuggestion: m.providerSuggestion ?? undefined
      }))
    : await generateMealPlan("Plan healthy dinners this week under ₹2000", {
        householdSize: user.householdSize,
        monthlyBudget: user.monthlyBudget,
        budgetRemaining: budgetStatus.remaining,
        dietType: user.dietType,
        dietaryGoal: user.dietaryGoal.toLowerCase(),
        cookingSkill: user.cookingSkill,
        cuisines: user.cuisines,
        allergies: user.allergies,
        city: user.city,
        pantry
      });

  const missingIngredients = getMissingIngredients(meals, pantry);

  const addressId = "addr_demo_home";
  const [food, restaurants] = await Promise.all([
    searchFood("high protein dinner", addressId),
    searchRestaurants("dinner", addressId)
  ]);

  const recommendation = buildTonightRecommendation({
    budgetLeft: budgetStatus.remaining,
    timeAvailableMins: 30,
    energyLevel: "low",
    missingIngredientsCount: missingIngredients.length,
    householdSize: user.householdSize || 2,
    goal: user.dietaryGoal.toLowerCase(),
    perMealBudget: Math.floor(user.monthlyBudget / 30)
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-primary">SmartMeal Ops</p>
          <h1 className="text-3xl font-semibold tracking-tight">Tonight&apos;s smartest move</h1>
          <p className="text-muted-foreground">Save money. Eat better. Let the copilot choose between cooking, ordering, and dining out.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            Review confirmation
            <ArrowRight className="h-4 w-4" />
          </Button>
          <UserButton />
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="space-y-4">
          <Card className="glass overflow-hidden">
            <div className="grid gap-5 md:grid-cols-[1.4fr_0.9fr] md:items-center">
              <div>
                <p className="text-sm font-medium uppercase text-primary">Recommendation</p>
                <h2 className="mt-1 text-2xl font-semibold">{recommendation.headline}</h2>
                <p className="mt-2 text-muted-foreground">{recommendation.reason}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="metric">
                  <p className="text-lg font-semibold">₹{recommendation.totalCost}</p>
                  <p className="text-muted-foreground">Cost</p>
                </div>
                <div className="metric">
                  <p className="text-lg font-semibold">{recommendation.etaMinutes}m</p>
                  <p className="text-muted-foreground">ETA</p>
                </div>
                <div className="metric">
                  <p className="text-lg font-semibold">₹{recommendation.estimatedSavings}</p>
                  <p className="text-muted-foreground">Saved</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Weekly Meal Plan</h2>
              <p className="text-sm text-muted-foreground">5 dinners under ₹2,000</p>
            </div>
            {meals.map((meal) => <MealPlanCard key={`${meal.day}-${meal.title}`} meal={meal} />)}
          </div>

          <Card className="glass">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Pantry Status</h2>
                <p className="mt-2 text-muted-foreground">Missing items detected: {missingIngredients.join(", ")}.</p>
              </div>
              <Button>
                <PackagePlus className="h-4 w-4" />
                Add Missing Groceries
              </Button>
            </div>
          </Card>

          <PantryManager pantryItems={pantryItems} />
        </div>

        <div className="space-y-4">
          <ConfirmationCard
            recommendation={recommendation}
            confirmData={
              recommendation.source === "COOK"
                ? { source: "COOK", addressId: "addr_demo_home", itemIds: missingIngredients.slice(0, 3) }
                : recommendation.source === "ORDER"
                  ? { source: "ORDER", addressId: "addr_demo_home", itemIds: [food[0]?.id ?? "f1"] }
                  : { source: "DINEOUT", restaurantId: restaurants[0]?.id ?? "d1", partySize: user.householdSize }
            }
          />
          <BudgetOverview
            monthlyBudget={budgetStatus.monthlyBudget}
            spent={budgetStatus.spent}
            bySource={budgetStatus.bySource}
          />
          <OrderList orders={orders} />
          <Card className="glass">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="mt-3 grid gap-2">
              <Button variant="secondary"><ShoppingBag className="h-4 w-4" />Restock Essentials</Button>
              <Button variant="secondary"><Utensils className="h-4 w-4" />Order Dinner Now</Button>
              <Button variant="secondary"><CalendarCheck className="h-4 w-4" />Book Dineout Table</Button>
            </div>
          </Card>
          <AssistantPanel compact />
        </div>
      </section>
    </main>
  );
}
