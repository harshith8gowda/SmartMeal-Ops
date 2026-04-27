import { MealPlanCard } from "@/components/cards/meal-plan-card";
import { ConfirmationCard } from "@/components/cards/confirmation-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetOverview } from "@/components/charts/budget-overview";
import { AssistantPanel } from "@/components/chat/assistant-panel";
import { getMissingIngredients, generateMealPlan } from "@/lib/ai/planner";
import { buildTonightRecommendation } from "@/lib/ai/decision-engine";
import { ArrowRight, CalendarCheck, PackagePlus, ShoppingBag, Utensils } from "lucide-react";

export default async function DashboardPage() {
  const meals = await generateMealPlan("Plan healthy dinners this week under ₹2000");
  const missingIngredients = getMissingIngredients(meals, ["Rice", "Bread", "Milk"]);
  const recommendation = buildTonightRecommendation({
    budgetLeft: 2500,
    timeAvailableMins: 30,
    energyLevel: "low",
    missingIngredientsCount: missingIngredients.length,
    householdSize: 2,
    goal: "high protein",
    perMealBudget: 700
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-primary">SmartMeal Ops</p>
          <h1 className="text-3xl font-semibold tracking-tight">Tonight&apos;s smartest move</h1>
          <p className="text-muted-foreground">Save money. Eat better. Let the copilot choose between cooking, ordering, and dining out.</p>
        </div>
        <Button>
          Review confirmation
          <ArrowRight className="h-4 w-4" />
        </Button>
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
        </div>

        <div className="space-y-4">
          <ConfirmationCard recommendation={recommendation} />
          <BudgetOverview />
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
