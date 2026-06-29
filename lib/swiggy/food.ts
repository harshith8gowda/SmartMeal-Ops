import { callSwiggyTool, hasSwiggyMcpSession } from "./mcp-client";
import { SwiggyItem } from "./types";

export interface FoodCartItem {
  name: string;
  quantity?: string;
  price?: number;
}

export interface FoodAddress {
  addressId: string;
  label: string;
  fullAddress: string;
}

function mockFood(query: string, cityOrAddress: string): SwiggyItem[] {
  return [
    { id: "f1", name: `${query} from Green Bowl`, price: 320, rating: 4.4, eta: 28, metadata: { cityOrAddress, calories: 620, protein: 34 } },
    { id: "f2", name: `${query} from Protein Hub`, price: 360, rating: 4.5, eta: 24, metadata: { cityOrAddress, calories: 690, protein: 42 } }
  ];
}

const mockAddresses: FoodAddress[] = [
  { addressId: "addr_demo_home", label: "Home", fullAddress: "Demo home address, Bengaluru" }
];

export async function getFoodAddresses(token?: string): Promise<FoodAddress[]> {
  if (!hasSwiggyMcpSession(token)) {
    return mockAddresses;
  }

  const result = await callSwiggyTool<FoodAddress[]>("food", "get_addresses", {}, token);
  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food get_addresses failed");
  }

  return result.data ?? [];
}

export async function searchFood(query: string, cityOrAddress: string, token?: string): Promise<SwiggyItem[]> {
  if (!hasSwiggyMcpSession(token)) {
    return mockFood(query, cityOrAddress);
  }

  const result = await callSwiggyTool<{ items?: SwiggyItem[]; restaurants?: SwiggyItem[] }>("food", "search_menu", {
    addressId: cityOrAddress,
    query
  }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food search_menu failed");
  }

  return result.data?.items ?? result.data?.restaurants ?? [];
}

export async function searchFoodRestaurants(query: string, addressId: string, token?: string): Promise<SwiggyItem[]> {
  if (!hasSwiggyMcpSession(token)) {
    return mockFood(query, addressId);
  }

  const result = await callSwiggyTool<{ restaurants?: SwiggyItem[] }>("food", "search_restaurants", {
    addressId,
    query
  }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food search_restaurants failed");
  }

  return result.data?.restaurants ?? [];
}

export async function createFoodCart(items: FoodCartItem[], token?: string): Promise<unknown> {
  if (!hasSwiggyMcpSession(token)) {
    return {
      cartId: `food_${Date.now()}`,
      items: items.map((item, i) => ({ id: `f${i + 1}`, name: item.name, price: item.price ?? 250 + i * 50 })),
      total: items.reduce((sum, item) => sum + (item.price ?? 300), 0),
      provider: "food"
    };
  }

  const result = await callSwiggyTool("food", "update_food_cart", { items }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food update_food_cart failed");
  }

  return result.data ?? result;
}
