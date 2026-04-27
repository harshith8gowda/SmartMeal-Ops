import { NextRequest, NextResponse } from "next/server";
import { placeFoodOrder } from "@/lib/swiggy/food";

export async function POST(req: NextRequest) {
  const { cartId, confirmed } = await req.json();
  if (!confirmed) {
    return NextResponse.json({ error: "User confirmation is required before placing an order." }, { status: 400 });
  }
  const order = await placeFoodOrder(cartId);
  return NextResponse.json(order);
}
