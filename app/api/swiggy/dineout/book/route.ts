import { NextRequest, NextResponse } from "next/server";
import { bookTable } from "@/lib/swiggy/dineout";

export async function POST(req: NextRequest) {
  const { restaurantId, partySize, slotISO } = await req.json();
  const booking = await bookTable(restaurantId, partySize, slotISO);
  return NextResponse.json(booking);
}
