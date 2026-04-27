export type DecisionSource = "COOK" | "ORDER" | "DINEOUT";

export interface MealCard {
  day: string;
  title: string;
  calories: number;
  protein: number;
  cost: number;
  prepMinutes: number;
  source: DecisionSource;
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
