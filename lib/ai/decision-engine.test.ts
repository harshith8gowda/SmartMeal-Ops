import { describe, expect, it } from "vitest";
import { buildRecommendations, buildTonightRecommendation, decideMealAction } from "./decision-engine";

const baseInput = {
  budgetLeft: 2000,
  timeAvailableMins: 30,
  energyLevel: "low" as const,
  missingIngredientsCount: 2,
  householdSize: 2,
  perMealBudget: 500
};

describe("decideMealAction", () => {
  it("orders when energy is low and time is short", () => {
    const result = decideMealAction(baseInput);
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
    const recommendation = buildTonightRecommendation(baseInput);

    expect(recommendation.source).toBe("ORDER");
    expect(recommendation.headline).toBeTruthy();
    expect(recommendation.totalCost).toBeGreaterThan(0);
    expect(recommendation.etaMinutes).toBeGreaterThan(0);
    expect(recommendation.confirmation).toBeDefined();
  });
});

describe("buildRecommendations", () => {
  it("returns all three sources without network calls", async () => {
    const result = await buildRecommendations({
      budget: 500,
      timeMinutes: 30,
      mood: "lazy",
      diet: [],
      allergies: [],
      pantry: []
    });

    expect(result.cook.source).toBe("cook");
    expect(result.order.source).toBe("order");
    expect(result.dineout.source).toBe("dineout");

    expect(result.cook.title).toBeTruthy();
    expect(result.order.title).toBeTruthy();
    expect(result.dineout.title).toBeTruthy();

    expect(result.cook.cost).toBeGreaterThan(0);
    expect(result.order.cost).toBeGreaterThan(0);
    expect(result.dineout.cost).toBeGreaterThan(0);

    expect(result.cook.items.length).toBeGreaterThan(0);
    expect(result.order.items.length).toBeGreaterThan(0);
    expect(result.dineout.items.length).toBeGreaterThan(0);
  });
});
