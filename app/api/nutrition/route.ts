import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getNutritionLogs, upsertNutritionLog } from "@/lib/db/nutrition";
import { mapErrorToResponse } from "@/lib/errors";
import { z } from "zod";

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
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const start = startParam ? z.coerce.date().parse(startParam) : new Date();
    const end = endParam ? z.coerce.date().parse(endParam) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const logs = await getNutritionLogs(user.id, start, end);

    return NextResponse.json({ logs });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

const NutritionLogSchema = z.object({
  date: z.string().datetime(),
  calories: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  carbs: z.coerce.number().min(0),
  fat: z.coerce.number().min(0)
});

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
    const parsed = NutritionLogSchema.parse(body);
    const log = await upsertNutritionLog(user.id, {
      date: new Date(parsed.date),
      calories: parsed.calories,
      protein: parsed.protein,
      carbs: parsed.carbs,
      fat: parsed.fat
    });

    return NextResponse.json({ log });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
