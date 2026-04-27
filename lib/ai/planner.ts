import { MealCard } from "@/types";

export async function generateMealPlan(prompt: string): Promise<MealCard[]> {
  const mock: MealCard[] = [
    { day: "Day 1", title: "Chicken Rice Bowl", calories: 610, protein: 41, cost: 320, prepMinutes: 35, source: "COOK" },
    { day: "Day 2", title: "Paneer Wrap", calories: 540, protein: 28, cost: 270, prepMinutes: 25, source: "COOK" },
    { day: "Day 3", title: "Swiggy Protein Thali", calories: 700, protein: 35, cost: 380, prepMinutes: 15, source: "ORDER" },
    { day: "Day 4", title: "Egg Toast Salad", calories: 490, protein: 26, cost: 220, prepMinutes: 20, source: "COOK" },
    { day: "Day 5", title: "Dineout Grill Night", calories: 760, protein: 45, cost: 600, prepMinutes: 90, source: "DINEOUT" }
  ];

  if (!process.env.OPENAI_API_KEY) return mock;

  // Real model integration can be added here. Fallback to mock for MVP stability.
  return mock.map((item) => ({ ...item, title: item.title + (prompt ? "" : "") }));
}
