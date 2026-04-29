import { callSwiggyTool, hasSwiggyMcpSession } from "./mcp-client";
import { CartResponse, SwiggyItem } from "./types";

export interface GroceryCartItem {
  spinId: string;
  quantity: number;
}

export async function searchGroceries(query: string, addressId: string): Promise<SwiggyItem[]> {
  if (!hasSwiggyMcpSession()) {
    return [
      { id: `g-${query.toLowerCase().replace(/\s+/g, "-")}-1`, name: `${query} - Daily Fresh`, price: 120, eta: 12, metadata: { addressId } },
      { id: `g-${query.toLowerCase().replace(/\s+/g, "-")}-2`, name: `${query} - Value Pack`, price: 180, eta: 15, metadata: { addressId } }
    ];
  }

  const result = await callSwiggyTool<{ products?: SwiggyItem[] }>("instamart", "search_products", {
    addressId,
    query
  });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Instamart search_products failed");
  }

  return result.data?.products ?? [];
}

export async function createGroceryCart(
  itemIds: string[],
  selectedAddressId = "addr_demo_home"
): Promise<CartResponse> {
  if (!hasSwiggyMcpSession()) {
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

  const result = await callSwiggyTool("instamart", "update_cart", {
    selectedAddressId,
    items: itemIds.map((spinId) => ({ spinId, quantity: 1 }))
  });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Instamart update_cart failed");
  }

  const cart = await getGroceryCart();
  return { ...cart, raw: result.data };
}

export async function getGroceryCart(): Promise<CartResponse> {
  if (!hasSwiggyMcpSession()) {
    return {
      cartId: "grocery_demo_cart",
      items: [{ id: "g1", name: "Eggs, paneer, tomatoes", price: 375 }],
      total: 375,
      fees: 29,
      eta: 18,
      provider: "instamart",
      requiresConfirmation: true
    };
  }

  const result = await callSwiggyTool<Record<string, unknown>>("instamart", "get_cart");

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Instamart get_cart failed");
  }

  return {
    cartId: "grocery_live_cart",
    items: [],
    total: 0,
    fees: 0,
    eta: 0,
    provider: "instamart",
    requiresConfirmation: true,
    raw: result.data
  };
}

export async function checkoutGroceries(addressId: string, paymentMethod?: string) {
  if (!hasSwiggyMcpSession()) {
    return { orderId: `order_im_${Date.now()}`, status: "CONFIRMED", trackingUrl: "/dashboard?tab=orders" };
  }

  const result = await callSwiggyTool("instamart", "checkout", {
    addressId,
    ...(paymentMethod ? { paymentMethod } : {})
  });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Instamart checkout failed");
  }

  return result.data ?? { status: "CONFIRMED", message: result.message };
}
