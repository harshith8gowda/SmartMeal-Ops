import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getBudgetStatus } from "@/lib/db/budget";
import { mapErrorToResponse } from "@/lib/errors";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureDbUser(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await getBudgetStatus(user.id);
    return NextResponse.json(status);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
