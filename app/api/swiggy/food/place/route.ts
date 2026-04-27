import { NextRequest, NextResponse } from "next/server";
import { placeFoodOrder } from "@/lib/swiggy/food";

export async function POST(req: NextRequest) {
  const { cartId } = await req.json();
  const order = await placeFoodOrder(cartId);
  return NextResponse.json(order);
}
