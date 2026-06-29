import { describe, expect, it, vi } from "vitest";
import { buildCart } from "./cart-builder";
import { createCartSession } from "@/lib/db/cart-session";
import type { Recommendation } from "./decision-engine";

vi.mock("@/lib/db/cart-session", () => ({
  createCartSession: vi.fn()
}));

vi.mock("@/lib/swiggy/food", () => ({
  createFoodCart: vi.fn(() => Promise.resolve({ cartId: "food_123" }))
}));

vi.mock("@/lib/swiggy/instamart", () => ({
  createGroceryCart: vi.fn(() => Promise.resolve({ cartId: "im_123" }))
}));

vi.mock("@/lib/swiggy/dineout", () => ({
  bookTable: vi.fn(() => Promise.resolve({ bookingId: "do_123" }))
}));

vi.mock("@/lib/swiggy/token", () => ({
  getSwiggyToken: vi.fn(() => Promise.resolve(undefined))
}));

describe("buildCart", () => {
  it("creates a cart session and returns a Swiggy redirect URL", async () => {
    const recommendation: Recommendation = {
      source: "order",
      title: "Test order",
      description: "Quick test",
      cost: 300,
      timeMinutes: 25,
      effort: "low",
      items: [{ name: "Test bowl", quantity: "1", price: 250 }],
      actionLabel: "Build cart",
      providerData: { source: "food" }
    };

    vi.mocked(createCartSession).mockResolvedValue({ id: "cart_123" } as Awaited<ReturnType<typeof createCartSession>>);

    const result = await buildCart("user_123", recommendation);

    expect(result.cartSessionId).toBe("cart_123");
    expect(result.redirectUrl).toBe("https://www.swiggy.com/cart");
    expect(createCartSession).toHaveBeenCalledWith("user_123", expect.objectContaining({
      source: "ORDER",
      status: "ready",
      redirectUrl: "https://www.swiggy.com/cart"
    }));
  });
});
