import { DecisionSource, Recommendation } from "@/types";

export interface DecisionInput {
  budgetLeft: number;
  timeAvailableMins: number;
  energyLevel: "low" | "medium" | "high";
  missingIngredientsCount: number;
  householdSize?: number;
  goal?: string;
  perMealBudget?: number;
}

export interface DecisionOutput {
  source: DecisionSource;
  reason: string;
}

export function decideMealAction(input: DecisionInput): DecisionOutput {
  const perMealBudget = input.perMealBudget ?? Math.max(350, Math.floor(input.budgetLeft / 7));

  if (input.energyLevel === "low" && input.timeAvailableMins < 40 && perMealBudget >= 300) {
    return { source: "ORDER", reason: "Ordering saves effort and keeps dinner inside tonight's time window." };
  }

  if (input.missingIngredientsCount > 5 && input.householdSize && input.householdSize <= 4 && input.budgetLeft > 1200) {
    return { source: "DINEOUT", reason: "Dining out avoids a heavy restock and creates the most convenient family plan." };
  }

  if (input.goal?.includes("protein") && input.timeAvailableMins >= 30) {
    return { source: "COOK", reason: "Cooking gives better protein control and keeps the weekly budget efficient." };
  }

  return { source: "COOK", reason: "Cooking is the most cost-efficient and goal-aligned option today." };
}

export function buildTonightRecommendation(input: DecisionInput): Recommendation {
  const decision = decideMealAction(input);
  const config: Record<DecisionSource, Omit<Recommendation, "source" | "reason">> = {
    COOK: {
      headline: "Cook a high-protein bowl at home",
      estimatedSavings: 260,
      etaMinutes: 35,
      totalCost: 420,
      confirmation: {
        title: "Instamart grocery cart",
        lineItems: [
          { label: "Eggs, 12 pack", price: 110 },
          { label: "Paneer, 200g", price: 150 },
          { label: "Tomatoes and greens", price: 115 }
        ],
        fees: 29,
        eta: "18 mins"
      }
    },
    ORDER: {
      headline: "Order dinner from a top-rated protein kitchen",
      estimatedSavings: 200,
      etaMinutes: 32,
      totalCost: 648,
      confirmation: {
        title: "Swiggy Food order",
        lineItems: [
          { label: "Chicken rice bowl x2", price: 520 },
          { label: "Side salad", price: 79 }
        ],
        fees: 49,
        eta: "32 mins"
      }
    },
    DINEOUT: {
      headline: "Reserve a table near you",
      estimatedSavings: 0,
      etaMinutes: 90,
      totalCost: 1400,
      confirmation: {
        title: "Dineout reservation",
        lineItems: [
          { label: "Table for 4", price: 0 },
          { label: "Estimated meal budget", price: 1400 }
        ],
        fees: 0,
        eta: "Tomorrow, 8:00 PM"
      }
    }
  };

  return {
    source: decision.source,
    reason: decision.reason,
    ...config[decision.source]
  };
}
