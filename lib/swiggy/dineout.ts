import { SwiggyItem } from "./types";

export async function searchRestaurants(query: string, city: string): Promise<SwiggyItem[]> {
  if (!process.env.SWIGGY_DINEOUT_API_KEY) {
    return [
      { id: "d1", name: `${query} Bistro`, price: 700, rating: 4.6 },
      { id: "d2", name: `${query} Social Kitchen`, price: 900, rating: 4.5 }
    ];
  }

  return [{ id: "live-dine", name: `${query} in ${city}`, price: 850, rating: 4.4 }];
}

export async function bookTable(restaurantId: string, partySize: number, slotISO: string) {
  return {
    bookingId: `book_${restaurantId}_${Date.now()}`,
    restaurantId,
    partySize,
    slotISO,
    status: "BOOKED"
  };
}
