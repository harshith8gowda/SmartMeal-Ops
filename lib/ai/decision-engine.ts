import { DecisionSource, Recommendation as LegacyRecommendation } from "@/types";
import { searchFood } from "@/lib/swiggy/food";
import { searchGroceries } from "@/lib/swiggy/instamart";
import { searchRestaurants } from "@/lib/swiggy/dineout";

export type DecisionSourceLower = "cook" | "order" | "dineout";

export type DecisionInput = {
  budget: number;
  timeMinutes: number;
  mood: string;
  diet: string[];
  allergies: string[];
  pantry: string[];
  addressId?: string;
  lat?: number;
  lng?: number;
};

export type RecommendationItem = {
  name: string;
  quantity?: string;
  price?: number;
};

export type Recommendation = {
  source: DecisionSourceLower;
  title: string;
  description: string;
  cost: number;
  timeMinutes: number;
  effort: "low" | "medium" | "high";
  imageUrl?: string;
  items: RecommendationItem[];
  actionLabel: string;
  providerData?: unknown;
};

export interface LegacyDecisionInput {
  budgetLeft: number;
  timeAvailableMins: number;
  energyLevel: "low" | "medium" | "high";
  missingIngredientsCount: number;
  householdSize?: number;
  goal?: string;
  perMealBudget?: number;
}

export interface LegacyDecisionOutput {
  source: DecisionSource;
  reason: string;
}

export function decideMealAction(input: LegacyDecisionInput): LegacyDecisionOutput {
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

export function buildTonightRecommendation(input: LegacyDecisionInput): LegacyRecommendation {
  const decision = decideMealAction(input);
  const config: Record<DecisionSource, Omit<LegacyRecommendation, "source" | "reason">> = {
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

function buildMockRecommendations(input: DecisionInput): {
  cook: Recommendation;
  order: Recommendation;
  dineout: Recommendation;
} {
  return {
    cook: {
      source: "cook",
      title: "Cook a high-protein bowl at home",
      description: "Pantry-friendly dinner with eggs, paneer, and fresh greens under your budget.",
      cost: Math.min(420, input.budget),
      timeMinutes: 35,
      effort: "medium",
      items: [
        { name: "Eggs, 12 pack", quantity: "1", price: 110 },
        { name: "Paneer, 200g", quantity: "1", price: 150 },
        { name: "Tomatoes and greens", quantity: "1", price: 115 }
      ],
      actionLabel: "Build Instamart cart",
      providerData: { source: "instamart" }
    },
    order: {
      source: "order",
      title: "Order dinner from a top-rated protein kitchen",
      description: "Quick delivery with minimal effort when you are short on time.",
      cost: Math.min(648, input.budget),
      timeMinutes: 32,
      effort: "low",
      items: [
        { name: "Chicken rice bowl x2", quantity: "2", price: 520 },
        { name: "Side salad", quantity: "1", price: 79 }
      ],
      actionLabel: "Build Swiggy cart",
      providerData: { source: "food" }
    },
    dineout: {
      source: "dineout",
      title: "Reserve a table near you",
      description: "Free table booking at a highly rated restaurant for a relaxed evening.",
      cost: Math.min(1400, input.budget),
      timeMinutes: 90,
      effort: "low",
      items: [
        { name: "Table for 4", price: 0 },
        { name: "Estimated meal budget", price: Math.min(1400, input.budget) }
      ],
      actionLabel: "Book on Dineout",
      providerData: { source: "dineout", restaurantId: "d1", partySize: 2 }
    }
  };
}

async function buildCookRecommendation(input: DecisionInput): Promise<Recommendation> {
  const base = buildMockRecommendations(input).cook;
  const groceries = await searchGroceries("protein groceries", input.addressId ?? "addr_demo_home", undefined);
  const items = groceries.slice(0, 3).map((g) => ({
    name: g.name,
    quantity: "1",
    price: g.price
  }));

  return {
    ...base,
    items: items.length ? items : base.items,
    providerData: { source: "instamart", items }
  };
}

async function buildOrderRecommendation(input: DecisionInput): Promise<Recommendation> {
  const base = buildMockRecommendations(input).order;
  const food = await searchFood("high protein dinner", input.addressId ?? "addr_demo_home", undefined);
  const items = food.slice(0, 2).map((f) => ({
    name: f.name,
    quantity: "1",
    price: f.price
  }));

  return {
    ...base,
    items: items.length ? items : base.items,
    providerData: { source: "food", items }
  };
}

async function buildDineoutRecommendation(input: DecisionInput): Promise<Recommendation> {
  const base = buildMockRecommendations(input).dineout;
  const restaurants = await searchRestaurants("dinner", input.addressId ?? "addr_demo_home", undefined);
  const restaurant = restaurants[0];

  return {
    ...base,
    items: restaurant ? [{ name: restaurant.name, price: restaurant.price }] : base.items,
    providerData: {
      source: "dineout",
      restaurantId: restaurant?.id ?? "d1",
      restaurantName: restaurant?.name ?? "Demo Bistro",
      partySize: 2,
      slotISO: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    }
  };
}

export async function buildRecommendations(input: DecisionInput): Promise<{
  cook: Recommendation;
  order: Recommendation;
  dineout: Recommendation;
}> {
  const [cook, order, dineout] = await Promise.all([
    buildCookRecommendation(input),
    buildOrderRecommendation(input),
    buildDineoutRecommendation(input)
  ]);
  return { cook, order, dineout };
}
