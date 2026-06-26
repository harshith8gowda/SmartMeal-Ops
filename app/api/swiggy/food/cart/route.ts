import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createFoodCart } from "@/lib/swiggy/food";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { requireUserId } from "@/lib/auth/clerk";
import { mapErrorToResponse } from "@/lib/errors";

const CartSchema = z.object({
  itemIds: z.array(z.string()).min(1),
  addressId: z.string().default("addr_demo_home")
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { itemIds, addressId } = CartSchema.parse(body);
    const token = await getSwiggyToken(userId);
    const cart = await createFoodCart(itemIds, { addressId }, token);
    return NextResponse.json(cart);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
