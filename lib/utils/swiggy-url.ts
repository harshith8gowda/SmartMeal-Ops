export function getSwiggyRedirectUrl(source: "cook" | "order" | "dineout"): string {
  if (source === "cook") {
    return "https://www.swiggy.com/instamart/checkout";
  }
  if (source === "order") {
    return "https://www.swiggy.com/cart";
  }
  return "https://www.swiggy.com/dineout";
}
