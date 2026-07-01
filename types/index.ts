export type DecisionSource = "COOK" | "ORDER" | "DINEOUT";
export type EnergyLevel = "low" | "medium" | "high";

export interface MealCard {
  day: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cost: number;
  prepMinutes: number;
  source: DecisionSource;
  reason?: string;
  ingredients?: string[];
  providerSuggestion?: string;
}

export interface UserPreferences {
  householdSize: number;
  dietType: "veg" | "non-veg" | "eggetarian";
  dietaryGoal: "high_protein" | "weight_loss" | "low_carb" | "balanced";
  monthlyBudgetInr: number;
  cookingSkill: "low" | "medium" | "high";
  cuisines: string[];
  allergies: string[];
  city: string;
}

export interface Recommendation {
  source: DecisionSource;
  headline: string;
  reason: string;
  estimatedSavings: number;
  etaMinutes: number;
  totalCost: number;
  confirmation: {
    title: string;
    lineItems: { label: string; price: number }[];
    fees: number;
    eta: string;
  };
}

export interface PantryPrediction {
  item: string;
  qty: string;
  status: "low" | "stable" | "due";
  nextRestock: string;
}
