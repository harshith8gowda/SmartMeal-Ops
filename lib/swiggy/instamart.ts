import { CartResponse, SwiggyItem } from "./types";

const INSTAMART_ENDPOINT = process.env.SWIGGY_INSTAMART_MCP_URL;

export async function searchGroceries(query: string, city: string): Promise<SwiggyItem[]> {
  if (!process.env.SWIGGY_INSTAMART_API_KEY || !INSTAMART_ENDPOINT) {
    return [
      { id: `g-${query.toLowerCase().replace(/\s+/g, "-")}-1`, name: `${query} - Daily Fresh`, price: 120, eta: 12, metadata: { city } },
      { id: `g-${query.toLowerCase().replace(/\s+/g, "-")}-2`, name: `${query} - Value Pack`, price: 180, eta: 15, metadata: { city } }
    ];
  }

  const response = await fetch(`${INSTAMART_ENDPOINT}/search`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.SWIGGY_INSTAMART_API_KEY}`
    },
    body: JSON.stringify({ query, city })
  });

  if (!response.ok) {
    throw new Error("Swiggy Instamart search failed");
  }

  return response.json();
}

export async function createGroceryCart(itemIds: string[]): Promise<CartResponse> {
  return {
    cartId: `grocery_${Date.now()}`,
    items: itemIds.map((id, i) => ({ id, name: `Grocery ${i + 1}`, price: 90 + i * 40 })),
    total: itemIds.length * 160,
    fees: 29,
    eta: 18,
    provider: "instamart",
    requiresConfirmation: true
  };
}
