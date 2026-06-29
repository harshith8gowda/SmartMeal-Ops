import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { buildCart } from "@/lib/ai/cart-builder";
import { recommendationSchema } from "@/lib/ai/schemas";
import { ensureDbUser } from "@/lib/auth/clerk";
import { mapErrorToResponse } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureDbUser(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const recommendation = recommendationSchema.parse(body.recommendation);
    const { cartSessionId, redirectUrl } = await buildCart(user.id, recommendation);

    return NextResponse.json({ cartSessionId, redirectUrl });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
