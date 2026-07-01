import { MealCard } from "@/types";
import { callOpenAIPlanner } from "./openai";
import { MealPlanItem } from "./schemas";
import { env } from "@/lib/env";

const mockMealPlan: MealCard[] = [
  {
    day: "Day 1",
    title: "Chicken Rice Bowl",
    calories: 610,
    protein: 41,
    carbs: 52,
    fat: 18,
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
    carbs: 38,
    fat: 24,
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
    carbs: 65,
    fat: 22,
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
    carbs: 30,
    fat: 20,
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
    carbs: 42,
    fat: 38,
    cost: 600,
    prepMinutes: 90,
    source: "DINEOUT",
    providerSuggestion: "Grill Social Kitchen",
    reason: "Good fit for a relaxed Friday meal."
  }
];

export type PlanContext = {
  householdSize: number;
  monthlyBudget: number;
  budgetRemaining: number;
  dietType: string;
  dietaryGoal: string;
  cookingSkill: string;
  cuisines: string[];
  allergies: string[];
  city: string;
  pantry: string[];
};

export async function generateMealPlan(prompt: string, context: PlanContext): Promise<MealCard[]> {
  if (!env.OPENAI_API_KEY) {
    return mockMealPlan;
  }

  try {
    const days = await callOpenAIPlanner({ prompt, userContext: context });
    return days.map(mapToMealCard);
  } catch (error) {
    console.warn("OpenAI planner failed, falling back to mock plan:", error);
    return mockMealPlan;
  }
}

function mapToMealCard(item: MealPlanItem): MealCard {
  return {
    day: item.day,
    title: item.title,
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
    cost: item.cost,
    prepMinutes: item.prepMinutes,
    source: item.source,
    ingredients: item.ingredients,
    reason: item.reason,
    providerSuggestion: item.providerSuggestion
  };
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
