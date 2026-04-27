import { NextRequest, NextResponse } from "next/server";
import { createFoodCart } from "@/lib/swiggy/food";

export async function POST(req: NextRequest) {
  const { itemIds } = await req.json();
  const cart = await createFoodCart(itemIds);
  return NextResponse.json(cart);
}
