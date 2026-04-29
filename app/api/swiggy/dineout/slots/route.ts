import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/swiggy/dineout";

export async function POST(req: NextRequest) {
  const { restaurantId, date, latitude, longitude } = await req.json();

  const slots = await getAvailableSlots(
    restaurantId,
    date,
    latitude && longitude ? { latitude, longitude } : undefined
  );

  return NextResponse.json({ slots });
}
