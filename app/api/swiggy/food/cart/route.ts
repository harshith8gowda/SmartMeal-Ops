import { NextRequest, NextResponse } from "next/server";
import { createFoodCart } from "@/lib/swiggy/food";

export async function POST(req: NextRequest) {
  const { itemIds, addressId = "addr_demo_home" } = await req.json();
  const cart = await createFoodCart(itemIds, { addressId });
  return NextResponse.json(cart);
}
