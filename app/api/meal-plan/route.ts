import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  getMealSlots,
  getMealSlotById,
  createMealSlot,
  updateMealSlot,
  deleteMealSlot,
  clearMealSlots,
  type MealSlotInput
} from "@/lib/db/meal-slot";
import { recalculateNutritionLogForDate } from "@/lib/db/nutrition";
import { createNotification } from "@/lib/db/notification";
import { ensureDbUser } from "@/lib/auth/clerk";
import { mapErrorToResponse } from "@/lib/errors";

const slotItemsSchema = z
  .object({
    ingredients: z.array(z.string()).optional(),
    providerSuggestion: z.any().optional(),
    nutrition: z
      .object({
        calories: z.number().min(0).optional(),
        protein: z.number().min(0).optional(),
        carbs: z.number().min(0).optional(),
        fat: z.number().min(0).optional()
      })
      .optional()
  })
  .optional();

const slotSchema = z.object({
  id: z.string().optional(),
  date: z.string().datetime(),
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  source: z.enum(["COOK", "ORDER", "DINEOUT"]),
  title: z.string(),
  description: z.string().optional(),
  cost: z.number().default(0),
  timeMinutes: z.number().default(0),
  effort: z.string().optional(),
  imageUrl: z.string().optional(),
  items: slotItemsSchema,
  cartSessionId: z.string().optional()
});

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
    const slots = await getMealSlots(user.id, start, end);

    return NextResponse.json({ slots });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

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
    const action = body.action;

    if (action === "clear") {
      const { start, end } = z.object({ start: z.coerce.date(), end: z.coerce.date() }).parse(body);
      await clearMealSlots(user.id, start, end);
      const dates = [];
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
      await Promise.all(dates.map((date) => recalculateNutritionLogForDate(user.id, date)));
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      const id = z.string().parse(body.id);
      const slot = await getMealSlotById(id, user.id);
      if (!slot) throw new Error("Slot not found");
      await deleteMealSlot(id, user.id);
      await recalculateNutritionLogForDate(user.id, slot.date);
      return NextResponse.json({ success: true });
    }

    const slots = z.array(slotSchema).parse(body.slots);
    const results = await Promise.all(
      slots.map((slot) => {
        const data: MealSlotInput = {
          date: new Date(slot.date),
          mealType: slot.mealType,
          source: slot.source,
          title: slot.title,
          description: slot.description,
          cost: slot.cost,
          timeMinutes: slot.timeMinutes,
          effort: slot.effort,
          imageUrl: slot.imageUrl,
          items: slot.items,
          cartSessionId: slot.cartSessionId
        };
        return slot.id ? updateMealSlot(slot.id, user.id, data) : createMealSlot(user.id, data);
      })
    );

    const dates = new Set(results.map((r) => r.date.toISOString().split("T")[0]));
    await Promise.all(
      [...dates].map((dateStr) => recalculateNutritionLogForDate(user.id, new Date(dateStr)))
    );

    const firstSlot = results[0];
    if (firstSlot) {
      await createNotification(user.id, {
        title: firstSlot.id ? "Meal slot updated" : "Meal slot saved",
        body: `"${firstSlot.title}" is planned for ${firstSlot.date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}.`,
        type: "meal_slot",
        actionUrl: "/meal-plan"
      });
    }

    return NextResponse.json({ slots: results });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
