import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkoutGroceries } from "@/lib/swiggy/instamart";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { requireUserId } from "@/lib/auth/clerk";
import { createOrder } from "@/lib/db/orders";
import { mapErrorToResponse } from "@/lib/errors";

const CheckoutSchema = z.object({
  addressId: z.string().default("addr_demo_home"),
  paymentMethod: z.string().optional(),
  confirmed: z.boolean()
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { addressId, paymentMethod, confirmed } = CheckoutSchema.parse(body);

    if (!confirmed) {
      return NextResponse.json({ error: "User confirmation is required before Instamart checkout." }, { status: 400 });
    }

    const token = await getSwiggyToken(userId);
    const order = await checkoutGroceries(addressId, paymentMethod, token);

    const orderResult = await createOrder({
      userId,
      provider: "instamart",
      source: "COOK",
      status: "CONFIRMED",
      total: 375,
      etaMinutes: 18,
      externalId: (order as { orderId?: string }).orderId ?? null,
      payload: order as unknown as Record<string, unknown>
    });

    return NextResponse.json({ ...order, dbOrderId: orderResult.id });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
