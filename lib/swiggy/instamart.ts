import { CartResponse, SwiggyItem } from "./types";

export async function searchGroceries(query: string, city: string): Promise<SwiggyItem[]> {
  if (!process.env.SWIGGY_INSTAMART_API_KEY) {
    return [
      { id: "g1", name: `${query} - Daily Fresh`, price: 120 },
      { id: "g2", name: `${query} - Value Pack`, price: 180 }
    ];
  }

  return [{ id: "live-grocery", name: `${query} (${city})`, price: 155 }];
}

export async function createGroceryCart(itemIds: string[]): Promise<CartResponse> {
  return {
    cartId: `grocery_${Date.now()}`,
    items: itemIds.map((id, i) => ({ id, name: `Grocery ${i + 1}`, price: 90 + i * 40 })),
    total: itemIds.length * 160,
    fees: 29,
    eta: 18
  };
}
