import { CartResponse, SwiggyItem } from "./types";

export async function searchFood(query: string, city: string): Promise<SwiggyItem[]> {
  if (!process.env.SWIGGY_FOOD_API_KEY) {
    return [
      { id: "f1", name: `${query} from Green Bowl`, price: 320, rating: 4.4, eta: 28 },
      { id: "f2", name: `${query} from Protein Hub`, price: 360, rating: 4.5, eta: 24 }
    ];
  }

  // Plug actual MCP Food endpoint here.
  return [{ id: "live-food", name: `${query} in ${city}`, price: 399, rating: 4.3, eta: 30 }];
}

export async function createFoodCart(itemIds: string[]): Promise<CartResponse> {
  return {
    cartId: `food_${Date.now()}`,
    items: itemIds.map((id, i) => ({ id, name: `Food Item ${i + 1}`, price: 250 + i * 50 })),
    total: itemIds.length * 300,
    fees: 49,
    eta: 32
  };
}

export async function placeFoodOrder(cartId: string) {
  return { orderId: `order_${cartId}`, status: "CONFIRMED", trackingUrl: "/dashboard?tab=orders" };
}
