import { getSwiggyRedirectUrl } from "@/lib/utils/swiggy-url";
import { createGroceryCart } from "@/lib/swiggy/instamart";
import { createFoodCart } from "@/lib/swiggy/food";
import { bookTable } from "@/lib/swiggy/dineout";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { createCartSession } from "@/lib/db/cart-session";
import type { Recommendation } from "@/lib/ai/decision-engine";

function toUpperMealSource(source: "cook" | "order" | "dineout"): "COOK" | "ORDER" | "DINEOUT" {
  return source.toUpperCase() as "COOK" | "ORDER" | "DINEOUT";
}

export async function buildCart(
  userId: string,
  recommendation: Recommendation
): Promise<{ cartSessionId: string; redirectUrl: string }> {
  const token = await getSwiggyToken(userId);
  let payload: unknown = null;

  if (recommendation.source === "cook") {
    payload = await createGroceryCart(recommendation.items, token);
  } else if (recommendation.source === "order") {
    payload = await createFoodCart(recommendation.items, token);
  } else {
    payload = await bookTable(recommendation.providerData, token);
  }

  const redirectUrl = getSwiggyRedirectUrl(recommendation.source);
  const session = await createCartSession(userId, {
    source: toUpperMealSource(recommendation.source),
    redirectUrl,
    payload,
    status: "ready"
  });

  return { cartSessionId: session.id, redirectUrl };
}
