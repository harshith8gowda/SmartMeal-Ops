import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { buildRecommendations } from "@/lib/ai/decision-engine";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getAddresses } from "@/lib/db/address";
import { getPreference } from "@/lib/db/preference";
import { mapErrorToResponse } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureDbUser(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const budget = Number(searchParams.get("budget") || 500);
    const timeMinutes = Number(searchParams.get("time") || 30);
    const mood = searchParams.get("mood") || "hungry";
    const addressId = searchParams.get("addressId") || undefined;

    const preference = await getPreference(user.id);
    const addresses = await getAddresses(user.id);
    const address =
      (addressId ? addresses.find((a) => a.id === addressId) : undefined) ||
      addresses.find((a) => a.isDefault) ||
      addresses[0];

    const recommendations = await buildRecommendations({
      budget,
      timeMinutes,
      mood,
      diet: preference?.diet || [],
      allergies: preference?.allergies || [],
      pantry: [],
      addressId: address?.id,
      lat: address?.lat ?? undefined,
      lng: address?.lng ?? undefined
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
