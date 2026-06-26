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

export async function bookTable(
  restaurantId: string,
  partySize: number,
  slotISO: string,
  geo: GeoPoint = BENGALURU,
  slot?: { slotId: number; itemId: string; reservationTime: number },
  token?: string
) {
  if (partySize < 1 || partySize > 20) {
    throw new Error("Party size must be between 1 and 20");
  }

  if (!hasSwiggyMcpSession(token)) {
    return {
      bookingId: `book_${restaurantId}_${Date.now()}`,
      restaurantId,
      partySize,
      slotISO,
      status: "BOOKED"
    };
  }

  if (!slot) {
    throw new Error("Dineout booking requires a free slot from get_available_slots.");
  }

  const result = await callSwiggyTool("dineout", "book_table", {
    restaurantId,
    slotId: slot.slotId,
    itemId: slot.itemId,
    reservationTime: slot.reservationTime,
    guestCount: partySize,
    latitude: geo.latitude,
    longitude: geo.longitude
  }, token);

  if (!result.success) {
    throw new Error(result.error?.message ?? "Swiggy Dineout book_table failed");
  }

  return result.data ?? { status: "BOOKED", message: result.message };
}
