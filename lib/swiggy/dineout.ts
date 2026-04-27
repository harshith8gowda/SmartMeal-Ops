import { SwiggyItem } from "./types";

const DINEOUT_ENDPOINT = process.env.SWIGGY_DINEOUT_MCP_URL;

export async function searchRestaurants(query: string, city: string): Promise<SwiggyItem[]> {
  if (!process.env.SWIGGY_DINEOUT_API_KEY || !DINEOUT_ENDPOINT) {
    return [
      { id: "d1", name: `${query} Bistro`, price: 700, rating: 4.6, metadata: { city, cuisine: "Modern Indian", available: true } },
      { id: "d2", name: `${query} Social Kitchen`, price: 900, rating: 4.5, metadata: { city, cuisine: "Grill", available: true } }
    ];
  }

  const response = await fetch(`${DINEOUT_ENDPOINT}/restaurants/search`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.SWIGGY_DINEOUT_API_KEY}`
    },
    body: JSON.stringify({ query, city })
  });

  if (!response.ok) {
    throw new Error("Swiggy Dineout search failed");
  }

  return response.json();
}

export async function bookTable(restaurantId: string, partySize: number, slotISO: string) {
  if (partySize < 1) {
    throw new Error("Party size must be at least 1");
  }

  return {
    bookingId: `book_${restaurantId}_${Date.now()}`,
    restaurantId,
    partySize,
    slotISO,
    status: "BOOKED"
  };
}
