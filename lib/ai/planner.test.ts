import { describe, expect, it } from "vitest";
import { generateMealPlan, getMissingIngredients } from "./planner";

const context = {
  householdSize: 2,
  monthlyBudget: 6000,
  budgetRemaining: 4500,
  dietType: "veg",
  dietaryGoal: "balanced",
  cookingSkill: "medium",
  cuisines: ["indian", "chinese"],
  allergies: ["peanuts"],
  city: "Bengaluru",
  pantry: ["Rice", "Paneer"]
};

describe("generateMealPlan", () => {
  it("falls back to mock plan when OPENAI_API_KEY is not set", async () => {
    const plan = await generateMealPlan("Plan healthy dinners", context);
    expect(plan).toHaveLength(5);
    expect(plan[0].title).toBeDefined();
    expect(plan[0].source).toBeDefined();
  });
});

describe("getMissingIngredients", () => {
  it("returns ingredients not in pantry", () => {
    const meals = [
      {
        day: "Day 1",
        title: "Test",
        calories: 100,
        protein: 10,
        cost: 100,
        prepMinutes: 10,
        source: "COOK" as const,
        ingredients: ["Rice", "Chicken", "Paneer"],
        reason: "Test"
      }
    ];
    const missing = getMissingIngredients(meals, ["rice", "paneer"]);
    expect(missing).toContain("Chicken");
    expect(missing).not.toContain("Rice");
  });

  it("returns empty array when pantry covers everything", () => {
    const meals = [
      {
        day: "Day 1",
        title: "Test",
        calories: 100,
        protein: 10,
        cost: 100,
        prepMinutes: 10,
        source: "COOK" as const,
        ingredients: ["Rice"],
        reason: "Test"
      }
    ];
    expect(getMissingIngredients(meals, ["rice"])).toHaveLength(0);
  });
});
