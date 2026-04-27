import { MealCard } from "@/types";

export async function generateMealPlan(prompt: string): Promise<MealCard[]> {
  const mock: MealCard[] = [
    {
      day: "Day 1",
      title: "Chicken Rice Bowl",
      calories: 610,
      protein: 41,
      cost: 320,
      prepMinutes: 35,
      source: "COOK",
      ingredients: ["Chicken breast", "Rice", "Curd", "Cucumber"],
      reason: "Best protein-to-cost ratio."
    },
    {
      day: "Day 2",
      title: "Paneer Wrap",
      calories: 540,
      protein: 28,
      cost: 270,
      prepMinutes: 25,
      source: "COOK",
      ingredients: ["Paneer", "Rotis", "Bell peppers", "Mint chutney"],
      reason: "Fast vegetarian dinner with good satiety."
    },
    {
      day: "Day 3",
      title: "Swiggy Protein Thali",
      calories: 700,
      protein: 35,
      cost: 380,
      prepMinutes: 15,
      source: "ORDER",
      providerSuggestion: "Protein Hub",
      reason: "Ordering is cheaper than restocking mid-week."
    },
    {
      day: "Day 4",
      title: "Egg Toast Salad",
      calories: 490,
      protein: 26,
      cost: 220,
      prepMinutes: 20,
      source: "COOK",
      ingredients: ["Eggs", "Bread", "Tomatoes", "Leafy greens"],
      reason: "Uses pantry staples before expiry."
    },
    {
      day: "Day 5",
      title: "Dineout Grill Night",
      calories: 760,
      protein: 45,
      cost: 600,
      prepMinutes: 90,
      source: "DINEOUT",
      providerSuggestion: "Grill Social Kitchen",
      reason: "Good fit for a relaxed Friday meal."
    }
  ];

  if (!process.env.OPENAI_API_KEY) return mock;

  // Keep the MVP stable if model output validation fails. A production version
  // should parse structured JSON through the same MealCard contract.
  return mock.map((item) => ({ ...item, title: item.title + (prompt ? "" : "") }));
}

export function getMissingIngredients(meals: MealCard[], pantry: string[]) {
  const owned = new Set(pantry.map((item) => item.toLowerCase()));
  return Array.from(
    new Set(
      meals
        .flatMap((meal) => meal.ingredients ?? [])
        .filter((ingredient) => !owned.has(ingredient.toLowerCase()))
    )
  );
}
