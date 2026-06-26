import { describe, expect, it } from "vitest";
import { buildTonightRecommendation, decideMealAction } from "./decision-engine";

describe("decideMealAction", () => {
  it("orders when energy is low and time is short", () => {
    const result = decideMealAction({
      budgetLeft: 2000,
      timeAvailableMins: 30,
      energyLevel: "low",
      missingIngredientsCount: 2,
      householdSize: 2,
      perMealBudget: 500
    });
    expect(result.source).toBe("ORDER");
  });

  it("dines out when too many ingredients are missing and budget is high", () => {
    const result = decideMealAction({
      budgetLeft: 1500,
      timeAvailableMins: 60,
      energyLevel: "medium",
      missingIngredientsCount: 7,
      householdSize: 3,
      perMealBudget: 500
    });
    expect(result.source).toBe("DINEOUT");
  });

  it("cooks when the goal is high protein and time allows", () => {
    const result = decideMealAction({
      budgetLeft: 1500,
      timeAvailableMins: 45,
      energyLevel: "medium",
      missingIngredientsCount: 1,
      goal: "high protein",
      perMealBudget: 500
    });
    expect(result.source).toBe("COOK");
  });

  it("defaults to cook", () => {
    const result = decideMealAction({
      budgetLeft: 300,
      timeAvailableMins: 60,
      energyLevel: "high",
      missingIngredientsCount: 1,
      perMealBudget: 200
    });
    expect(result.source).toBe("COOK");
  });
});

describe("buildTonightRecommendation", () => {
  it("returns a recommendation with required fields", () => {
    const recommendation = buildTonightRecommendation({
      budgetLeft: 2000,
      timeAvailableMins: 30,
      energyLevel: "low",
      missingIngredientsCount: 2,
      householdSize: 2,
      perMealBudget: 500
    });

    expect(recommendation.source).toBe("ORDER");
    expect(recommendation.headline).toBeTruthy();
    expect(recommendation.totalCost).toBeGreaterThan(0);
    expect(recommendation.etaMinutes).toBeGreaterThan(0);
    expect(recommendation.confirmation).toBeDefined();
  });
});
