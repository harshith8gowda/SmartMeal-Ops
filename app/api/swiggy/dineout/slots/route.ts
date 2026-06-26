import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/swiggy/dineout";
import { getSwiggyToken } from "@/lib/swiggy/token";
import { requireUserId } from "@/lib/auth/clerk";
import { mapErrorToResponse } from "@/lib/errors";

const SlotsSchema = z.object({
  restaurantId: z.string().min(1),
  date: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { restaurantId, date, latitude, longitude } = SlotsSchema.parse(body);
    const token = await getSwiggyToken(userId);
    const slots = await getAvailableSlots(
      restaurantId,
      date,
      latitude && longitude ? { latitude, longitude } : undefined,
      token
    );
    return NextResponse.json({ slots });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
