import { CartResponse, SwiggyItem } from "./types";

const FOOD_ENDPOINT = process.env.SWIGGY_FOOD_MCP_URL;

export async function searchFood(query: string, city: string): Promise<SwiggyItem[]> {
  if (!process.env.SWIGGY_FOOD_API_KEY || !FOOD_ENDPOINT) {
    return [
      { id: "f1", name: `${query} from Green Bowl`, price: 320, rating: 4.4, eta: 28, metadata: { city, calories: 620, protein: 34 } },
      { id: "f2", name: `${query} from Protein Hub`, price: 360, rating: 4.5, eta: 24, metadata: { city, calories: 690, protein: 42 } }
    ];
  }

  const response = await fetch(`${FOOD_ENDPOINT}/search`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.SWIGGY_FOOD_API_KEY}`
    },
    body: JSON.stringify({ query, city })
  });

  if (!response.ok) {
    throw new Error("Swiggy Food search failed");
  }

  return response.json();
}

export async function createFoodCart(itemIds: string[]): Promise<CartResponse> {
  return {
    cartId: `food_${Date.now()}`,
    items: itemIds.map((id, i) => ({ id, name: `Food Item ${i + 1}`, price: 250 + i * 50 })),
    total: itemIds.length * 300,
    fees: 49,
    eta: 32,
    provider: "food",
    requiresConfirmation: true
  };
}

export async function placeFoodOrder(cartId: string) {
  if (!cartId.startsWith("food_")) {
    throw new Error("Invalid food cart id");
  }

  return { orderId: `order_${cartId}`, status: "CONFIRMED", trackingUrl: "/dashboard?tab=orders" };
}
