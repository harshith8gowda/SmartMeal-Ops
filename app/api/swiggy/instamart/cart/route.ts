import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createGroceryCart } from "@/lib/swiggy/instamart";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { requireUserId } from "@/lib/auth/clerk";
import { mapErrorToResponse } from "@/lib/errors";

const CartSchema = z.object({
  items: z.array(z.object({ name: z.string(), quantity: z.string().optional(), price: z.number().optional() })).min(1)
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { items } = CartSchema.parse(body);
    const token = await getSwiggyToken(userId);
    const cart = await createGroceryCart(items, token);
    return NextResponse.json(cart);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
