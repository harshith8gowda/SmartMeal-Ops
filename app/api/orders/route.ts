import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/clerk";
import { getOrders } from "@/lib/db/orders";
import { mapErrorToResponse } from "@/lib/errors";

export async function GET() {
  try {
    const userId = await requireUserId();
    const orders = await getOrders(userId, 10);
    return NextResponse.json(orders);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
