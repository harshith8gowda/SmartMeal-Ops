import { callSwiggyTool, hasSwiggyMcpSession } from "./mcp-client";
import { SwiggyItem } from "./types";

export interface GroceryCartItem {
  name: string;
  quantity?: string;
  price?: number;
}

export async function searchGroceries(query: string, addressId: string, token?: string): Promise<SwiggyItem[]> {
  if (!hasSwiggyMcpSession(token)) {
    return [
      { id: `g-${query.toLowerCase().replace(/\s+/g, "-")}-1`, name: `${query} - Daily Fresh`, price: 120, eta: 12, metadata: { addressId } },
      { id: `g-${query.toLowerCase().replace(/\s+/g, "-")}-2`, name: `${query} - Value Pack`, price: 180, eta: 15, metadata: { addressId } }
    ];
  }

  const result = await callSwiggyTool<{ products?: SwiggyItem[] }>("instamart", "search_products", {
    addressId,
    query
  }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Instamart search_products failed");
  }

  return result.data?.products ?? [];
}

export async function createGroceryCart(items: GroceryCartItem[], token?: string): Promise<unknown> {
  if (!hasSwiggyMcpSession(token)) {
    return {
      cartId: `grocery_${Date.now()}`,
      items: items.map((item, i) => ({ id: `g${i + 1}`, name: item.name, price: item.price ?? 90 + i * 40 })),
      total: items.reduce((sum, item) => sum + (item.price ?? 120), 0),
      provider: "instamart"
    };
  }

  const result = await callSwiggyTool("instamart", "update_cart", { items }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Instamart update_cart failed");
  }

  return result.data ?? result;
}
