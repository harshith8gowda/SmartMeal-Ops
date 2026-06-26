import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { bookTable } from "@/lib/swiggy/dineout";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { requireUserId } from "@/lib/auth/clerk";
import { createOrder } from "@/lib/db/orders";
import { mapErrorToResponse } from "@/lib/errors";

const BookSchema = z.object({
  restaurantId: z.string().min(1),
  partySize: z.coerce.number().min(1).max(20),
  slotISO: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  slot: z.object({
    slotId: z.number(),
    itemId: z.string(),
    reservationTime: z.number()
  }).optional(),
  confirmed: z.boolean()
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { restaurantId, partySize, slotISO, latitude, longitude, slot, confirmed } = BookSchema.parse(body);

    if (!confirmed) {
      return NextResponse.json({ error: "User confirmation is required before booking a table." }, { status: 400 });
    }

    if (slot && typeof slot === "object" && "bookingPrice" in slot && (slot as { bookingPrice: number }).bookingPrice > 0) {
      return NextResponse.json({ error: "Only free reservations are allowed." }, { status: 400 });
    }

    const token = await getSwiggyToken(userId);
    const booking = await bookTable(
      restaurantId,
      partySize,
      slotISO,
      latitude && longitude ? { latitude, longitude } : undefined,
      slot,
      token
    );

    const orderResult = await createOrder({
      userId,
      provider: "dineout",
      source: "DINEOUT",
      status: "CONFIRMED",
      total: 0,
      etaMinutes: 90,
      externalId: (booking as { bookingId?: string }).bookingId ?? null,
      payload: booking as unknown as Record<string, unknown>
    });

    return NextResponse.json({ ...booking, dbOrderId: orderResult.id });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
