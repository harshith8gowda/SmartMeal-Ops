import { NextRequest, NextResponse } from "next/server";
import { bookTable } from "@/lib/swiggy/dineout";

export async function POST(req: NextRequest) {
  const { restaurantId, partySize, slotISO, latitude, longitude, slot, confirmed } = await req.json();
  if (!confirmed) {
    return NextResponse.json({ error: "User confirmation is required before booking a table." }, { status: 400 });
  }
  const booking = await bookTable(
    restaurantId,
    partySize,
    slotISO,
    latitude && longitude ? { latitude, longitude } : undefined,
    slot
  );
  return NextResponse.json(booking);
}
