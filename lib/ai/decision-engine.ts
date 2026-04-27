import { DecisionSource } from "@/types";

export interface DecisionInput {
  budgetLeft: number;
  timeAvailableMins: number;
  energyLevel: "low" | "medium" | "high";
  missingIngredientsCount: number;
}

export interface DecisionOutput {
  source: DecisionSource;
  reason: string;
}

export function decideMealAction(input: DecisionInput): DecisionOutput {
  if (input.energyLevel === "low" && input.timeAvailableMins < 35) {
    return { source: "ORDER", reason: "Ordering saves effort and minimizes prep time tonight." };
  }

  if (input.missingIngredientsCount > 5 && input.budgetLeft > 1000) {
    return { source: "DINEOUT", reason: "Dining out avoids a heavy restock and keeps planning simple." };
  }

  return { source: "COOK", reason: "Cooking is the most cost-efficient and goal-aligned option for today." };
}
