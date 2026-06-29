import { callSwiggyTool, hasSwiggyMcpSession } from "./mcp-client";
import { GeoPoint, SwiggyItem } from "./types";

const BENGALURU: GeoPoint = { latitude: 12.9716, longitude: 77.5946 };

export async function searchRestaurants(query: string, cityOrAddressId: string, token?: string): Promise<SwiggyItem[]> {
  if (!hasSwiggyMcpSession(token)) {
    return [
      { id: "d1", name: `${query} Bistro`, price: 700, rating: 4.6, metadata: { cityOrAddressId, cuisine: "Modern Indian", available: true } },
      { id: "d2", name: `${query} Social Kitchen`, price: 900, rating: 4.5, metadata: { cityOrAddressId, cuisine: "Grill", available: true } }
    ];
  }

  const result = await callSwiggyTool<{ restaurants?: SwiggyItem[] }>("dineout", "search_restaurants_dineout", {
    query,
    addressId: cityOrAddressId
  }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Dineout search_restaurants_dineout failed");
  }

  return result.data?.restaurants ?? [];
}

export async function getAvailableSlots(restaurantId: string, date: string, geo: GeoPoint = BENGALURU, token?: string) {
  if (!hasSwiggyMcpSession(token)) {
    return {
      slots: [
        {
          dateStr: date,
          displayTime: "8:00 PM",
          reservationTime: Math.floor(new Date(`${date}T20:00:00+05:30`).getTime() / 1000),
          deals: [{ slotId: 4242, itemId: `${restaurantId}-ticket_demo`, isFree: true, bookingPrice: 0 }]
        }
      ]
    };
  }

  const result = await callSwiggyTool("dineout", "get_available_slots", {
    restaurantId,
    date,
    latitude: geo.latitude,
    longitude: geo.longitude
  }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Dineout get_available_slots failed");
  }

  return result.data;
}

export async function bookTable(providerData: unknown, token?: string): Promise<unknown> {
  if (!hasSwiggyMcpSession(token)) {
    const data = providerData as Record<string, unknown> | undefined;
    return {
      bookingId: `book_${data?.restaurantId ?? "demo"}_${Date.now()}`,
      restaurantId: data?.restaurantId ?? "demo_restaurant",
      partySize: data?.partySize ?? 2,
      slotISO: data?.slotISO ?? new Date().toISOString().split("T")[0],
      status: "BOOKED"
    };
  }

  const result = await callSwiggyTool("dineout", "book_table", { ...(providerData as object), freeOnly: true }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Dineout book_table failed");
  }

  return result.data ?? { status: "BOOKED", message: result.message };
}
