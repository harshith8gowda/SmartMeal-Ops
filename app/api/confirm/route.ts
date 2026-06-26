import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { createOrder } from "@/lib/db/orders";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { createGroceryCart, checkoutGroceries } from "@/lib/swiggy/instamart";
import { createFoodCart, placeFoodOrder } from "@/lib/swiggy/food";
import { getAvailableSlots, bookTable } from "@/lib/swiggy/dineout";
import { mapErrorToResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const ConfirmSchema = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("COOK"),
    addressId: z.string().default("addr_demo_home"),
    itemIds: z.array(z.string()).min(1),
    confirmed: z.boolean()
  }),
  z.object({
    source: z.literal("ORDER"),
    addressId: z.string().default("addr_demo_home"),
    itemIds: z.array(z.string()).min(1),
    paymentMethod: z.string().optional(),
    confirmed: z.boolean()
  }),
  z.object({
    source: z.literal("DINEOUT"),
    restaurantId: z.string().min(1),
    partySize: z.coerce.number().min(1).max(20),
    slotISO: z.string().min(1).optional(),
    slot: z.object({
      slotId: z.number(),
      itemId: z.string(),
      reservationTime: z.number()
    }).optional(),
    confirmed: z.boolean()
  })
]);

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    await rateLimit(`confirm:${userId}`, 5, 60);
    const body = await req.json();
    const parsed = ConfirmSchema.parse(body);
    const token = await getSwiggyToken(userId);

    let result: Record<string, unknown>;
    let orderInput: Parameters<typeof createOrder>[0];

    if (parsed.source === "COOK") {
      await createGroceryCart(parsed.itemIds, parsed.addressId, token);
      result = (await checkoutGroceries(parsed.addressId, undefined, token)) as Record<string, unknown>;
      orderInput = {
        userId,
        provider: "instamart",
        source: "COOK",
        status: "CONFIRMED",
        total: 375,
        etaMinutes: 18,
        externalId: (result as { orderId?: string }).orderId ?? null,
        payload: result
      };
    } else if (parsed.source === "ORDER") {
      await createFoodCart(parsed.itemIds, { addressId: parsed.addressId }, token);
      result = (await placeFoodOrder(parsed.addressId, parsed.paymentMethod, token)) as Record<string, unknown>;
      orderInput = {
        userId,
        provider: "food",
        source: "ORDER",
        status: "CONFIRMED",
        total: 599,
        etaMinutes: 32,
        externalId: (result as { orderId?: string }).orderId ?? null,
        payload: result
      };
    } else {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const slotISO = parsed.slotISO || `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
      let slot = parsed.slot;
      if (!slot) {
        const slots = await getAvailableSlots(parsed.restaurantId, slotISO, undefined, token);
        const firstSlot = (slots as {
          slots?: {
            reservationTime?: number;
            deals?: { slotId: number; itemId: string; isFree?: boolean; bookingPrice?: number }[];
          }[];
        }).slots?.[0];
        const freeDeal = firstSlot?.deals?.find((d) => d.isFree || d.bookingPrice === 0);
        if (!freeDeal) {
          return NextResponse.json({ error: "No free slot available" }, { status: 400 });
        }
        slot = {
          slotId: freeDeal.slotId,
          itemId: freeDeal.itemId,
          reservationTime: firstSlot?.reservationTime ?? Math.floor(Date.now() / 1000)
        };
      }
      result = (await bookTable(parsed.restaurantId, parsed.partySize, slotISO, undefined, slot, token)) as Record<string, unknown>;
      orderInput = {
        userId,
        provider: "dineout",
        source: "DINEOUT",
        status: "CONFIRMED",
        total: 0,
        etaMinutes: 90,
        externalId: (result as { bookingId?: string }).bookingId ?? null,
        payload: result
      };
    }

    const order = await createOrder(orderInput);
    return NextResponse.json({ ...result, dbOrderId: order.id });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
