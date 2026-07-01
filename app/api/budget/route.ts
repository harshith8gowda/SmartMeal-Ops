import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getBudgetStatus } from "@/lib/db/budget";
import { getNotifications, createNotification } from "@/lib/db/notification";
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

    const threshold = status.monthlyBudget * 0.8;
    if (status.spent >= threshold && status.monthlyBudget > 0) {
      const existing = await getNotifications(user.id, 10);
      const hasUnreadAlert = existing.some((n) => n.type === "budget_alert" && !n.read);
      if (!hasUnreadAlert) {
        await createNotification(user.id, {
          title: "Budget alert",
          body: `You've used ${Math.round((status.spent / status.monthlyBudget) * 100)}% of your monthly food budget. ₹${status.remaining} remaining.`,
          type: "budget_alert",
          actionUrl: "/orders"
        });
      }
    }

    return NextResponse.json(status);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
