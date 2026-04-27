import { MealPlanCard } from "@/components/cards/meal-plan-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetOverview } from "@/components/charts/budget-overview";
import { generateMealPlan } from "@/lib/ai/planner";

export default async function DashboardPage() {
  const meals = await generateMealPlan("Plan healthy dinners this week under ₹2000");

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tonight’s smartest move</h1>
          <p className="text-slate-600">Save money. Eat better.</p>
        </div>
        <Button>Final Confirmation</Button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card className="glass">
            <h2 className="text-xl font-semibold">Tonight Recommendation</h2>
            <p className="mt-2 text-slate-600">Ordering saves ₹200 and 40 mins tonight.</p>
          </Card>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Weekly Meal Plan</h2>
            {meals.map((meal) => <MealPlanCard key={`${meal.day}-${meal.title}`} meal={meal} />)}
          </div>

          <Card className="glass">
            <h2 className="text-xl font-semibold">Pantry Status</h2>
            <p className="mt-3 text-slate-600">Missing items detected: Eggs, Paneer, Rice, Tomatoes.</p>
            <Button className="mt-4">Add Missing Groceries</Button>
          </Card>
        </div>

        <div className="space-y-4">
          <BudgetOverview />
          <Card className="glass">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="mt-3 grid gap-2">
              <Button variant="secondary">Restock Essentials</Button>
              <Button variant="secondary">Order Dinner Now</Button>
              <Button variant="secondary">Book Dineout Table</Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
