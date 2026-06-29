import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { MealPlanCard } from "@/components/cards/meal-plan-card";
import { ConfirmationCard } from "@/components/cards/confirmation-card";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetOverview } from "@/components/charts/budget-overview";
import { AssistantPanel } from "@/components/chat/assistant-panel";
import { OrderList } from "@/components/orders/order-list";
import { PantryManager } from "@/components/pantry/pantry-manager";
import { getMissingIngredients, generateMealPlan } from "@/lib/ai/planner";
import { buildTonightRecommendation } from "@/lib/ai/decision-engine";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { searchFood, getFoodAddresses } from "@/lib/swiggy/food";
import { searchRestaurants } from "@/lib/swiggy/dineout";
import { getUserWithPreferences } from "@/lib/db/user";
import { getPantryItems } from "@/lib/db/pantry";
import { getMealPlans } from "@/lib/db/meal-plan";
import { getBudgetStatus } from "@/lib/db/budget";
import { getOrders } from "@/lib/db/orders";
import { UserButton } from "@clerk/nextjs";
import { SwiggyConnectStatus } from "@/components/swiggy/connect-status";
import { ArrowRight, Bot, CalendarCheck, ChefHat, PackagePlus, ShoppingBag, Sparkles, Utensils } from "lucide-react";

export const metadata = {
  title: "Dashboard",
  description: "Your personalized SmartMeal Ops dashboard with AI recommendations, meal plans, and budget tracking."
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in" as never);
  }

  const user = await getUserWithPreferences(userId);

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

  const token = await getSwiggyToken(userId);
  const addresses = token ? await getFoodAddresses(token) : [];
  const addressId = addresses[0]?.addressId ?? "addr_demo_home";

  const [food, restaurants] = await Promise.all([
    searchFood("high protein dinner", addressId, token),
    searchRestaurants("dinner", addressId, token)
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

  const SourceIcon = {
    COOK: ChefHat,
    ORDER: ShoppingBag,
    DINEOUT: Utensils
  }[recommendation.source];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
            <Sparkles className="h-4 w-4" /> SmartMeal Ops
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Tonight&apos;s smartest move</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Save money. Eat better. Let the copilot choose between cooking, ordering, and dining out.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SwiggyConnectStatus />
          <Button asChild>
            <a href="#confirm">Review confirmation <ArrowRight className="h-4 w-4" /></a>
          </Button>
          <UserButton />
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-5">
          <Card className="gradient-border relative overflow-hidden p-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative grid gap-6 p-6 md:grid-cols-[1.3fr_0.9fr] md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <SourceIcon className="h-5 w-5 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{recommendation.source} Recommendation</p>
                </div>
                <h2 className="text-2xl font-semibold md:text-3xl">{recommendation.headline}</h2>
                <p className="mt-2 text-muted-foreground">{recommendation.reason}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Cost", value: `₹${recommendation.totalCost}` },
                  { label: "ETA", value: `${recommendation.etaMinutes}m` },
                  { label: "Saved", value: `₹${recommendation.estimatedSavings}` }
                ].map((m) => (
                  <div key={m.label} className="metric">
                    <p className="text-lg font-semibold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Weekly Meal Plan</h2>
                <p className="text-sm text-muted-foreground">5 dinners under ₹2,000</p>
              </div>
              <Button variant="secondary" size="sm">Regenerate</Button>
            </div>
            {meals.map((meal) => <MealPlanCard key={`${meal.day}-${meal.title}`} meal={meal} />)}
          </div>

          <Card className="gradient-border">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">Pantry Status</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Missing items: {missingIngredients.length > 0 ? missingIngredients.join(", ") : "None"}.
                </p>
              </div>
              <Button>
                <PackagePlus className="h-4 w-4" /> Add Missing Groceries
              </Button>
            </div>
          </Card>

          <PantryManager pantryItems={pantryItems} />
        </div>

        <div className="space-y-5">
          <div id="confirm">
            <ConfirmationCard
              recommendation={recommendation}
              confirmData={
                recommendation.source === "COOK"
                  ? { source: "COOK", addressId, itemIds: missingIngredients.slice(0, 3) }
                  : recommendation.source === "ORDER"
                    ? { source: "ORDER", addressId, itemIds: [food[0]?.id ?? "f1"] }
                    : { source: "DINEOUT", restaurantId: restaurants[0]?.id ?? "d1", partySize: user.householdSize }
              }
            />
          </div>
          <BudgetOverview
            monthlyBudget={budgetStatus.monthlyBudget}
            spent={budgetStatus.spent}
            bySource={budgetStatus.bySource}
          />
          <OrderList orders={orders} />
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>One-tap moves for tonight</CardDescription>
            </CardHeader>
            <div className="grid gap-2 px-5 pb-5">
              <Button variant="secondary"><ShoppingBag className="h-4 w-4" /> Restock Essentials</Button>
              <Button variant="secondary"><Utensils className="h-4 w-4" /> Order Dinner Now</Button>
              <Button variant="secondary"><CalendarCheck className="h-4 w-4" /> Book Dineout Table</Button>
            </div>
          </Card>
          <Card className="gradient-border overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">AI Copilot</h3>
            </div>
            <AssistantPanel compact />
          </Card>
        </div>
      </section>
    </main>
  );
}
