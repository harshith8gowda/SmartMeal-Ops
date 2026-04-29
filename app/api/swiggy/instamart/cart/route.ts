import { NextRequest, NextResponse } from "next/server";
import { createGroceryCart } from "@/lib/swiggy/instamart";

export async function POST(req: NextRequest) {
  const { itemIds, selectedAddressId } = await req.json();
  const cart = await createGroceryCart(itemIds, selectedAddressId);
  return NextResponse.json(cart);
}
