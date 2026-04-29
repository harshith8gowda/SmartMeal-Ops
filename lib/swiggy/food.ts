import { callSwiggyTool, hasSwiggyMcpSession } from "./mcp-client";
import { CartResponse, DeliveryAddressRef, SwiggyItem } from "./types";

export interface FoodCartItem {
  menuItemId: string;
  quantity: number;
  variations?: unknown[];
  variantsV2?: unknown[];
  addons?: unknown[];
}

function mockFood(query: string, cityOrAddress: string): SwiggyItem[] {
  return [
    { id: "f1", name: `${query} from Green Bowl`, price: 320, rating: 4.4, eta: 28, metadata: { cityOrAddress, calories: 620, protein: 34 } },
    { id: "f2", name: `${query} from Protein Hub`, price: 360, rating: 4.5, eta: 24, metadata: { cityOrAddress, calories: 690, protein: 42 } }
  ];
}

export async function getFoodAddresses() {
  if (!hasSwiggyMcpSession()) {
    return [{ addressId: "addr_demo_home", label: "Home", fullAddress: "Demo home address, Bengaluru" }];
  }

  return callSwiggyTool("food", "get_addresses");
}

export async function searchFood(query: string, cityOrAddress: string): Promise<SwiggyItem[]> {
  if (!hasSwiggyMcpSession()) {
    return mockFood(query, cityOrAddress);
  }

  const result = await callSwiggyTool<{ items?: SwiggyItem[]; restaurants?: SwiggyItem[] }>("food", "search_menu", {
    addressId: cityOrAddress,
    query
  });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food search_menu failed");
  }

  return result.data?.items ?? result.data?.restaurants ?? [];
}

export async function searchFoodRestaurants(query: string, addressId: string): Promise<SwiggyItem[]> {
  if (!hasSwiggyMcpSession()) {
    return mockFood(query, addressId);
  }

  const result = await callSwiggyTool<{ restaurants?: SwiggyItem[] }>("food", "search_restaurants", {
    addressId,
    query
  });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food search_restaurants failed");
  }

  return result.data?.restaurants ?? [];
}

export async function createFoodCart(
  itemIds: string[],
  address: DeliveryAddressRef = { addressId: "addr_demo_home" }
): Promise<CartResponse> {
  if (!hasSwiggyMcpSession()) {
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

  const restaurantId = itemIds[0]?.split(":")[0];
  if (!restaurantId) {
    throw new Error("Food cart creation requires restaurant-scoped item ids.");
  }

  const result = await callSwiggyTool("food", "update_food_cart", {
    restaurantId,
    addressId: address.addressId,
    cartItems: itemIds.map((id) => ({ menuItemId: id, quantity: 1 }))
  });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food update_food_cart failed");
  }

  const cart = await getFoodCart(address.addressId);
  return { ...cart, raw: result.data };
}

export async function getFoodCart(addressId: string): Promise<CartResponse> {
  if (!hasSwiggyMcpSession()) {
    return {
      cartId: "food_demo_cart",
      items: [{ id: "f1", name: "Chicken rice bowl x2", price: 520 }],
      total: 599,
      fees: 49,
      eta: 32,
      provider: "food",
      requiresConfirmation: true
    };
  }

  const result = await callSwiggyTool<Record<string, unknown>>("food", "get_food_cart", { addressId });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food get_food_cart failed");
  }

  return {
    cartId: "food_live_cart",
    items: [],
    total: 0,
    fees: 0,
    eta: 0,
    provider: "food",
    requiresConfirmation: true,
    raw: result.data
  };
}

export async function placeFoodOrder(addressId: string, paymentMethod?: string) {
  if (!hasSwiggyMcpSession()) {
    return { orderId: `order_food_${Date.now()}`, status: "CONFIRMED", trackingUrl: "/dashboard?tab=orders" };
  }

  const result = await callSwiggyTool("food", "place_food_order", {
    addressId,
    ...(paymentMethod ? { paymentMethod } : {})
  });

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Food place_food_order failed");
  }

  return result.data ?? { status: "CONFIRMED", message: result.message };
}
