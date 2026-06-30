import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getMealSlots } from "@/lib/db/meal-slot";
import { getPantryItems } from "@/lib/db/pantry";
import { mapErrorToResponse } from "@/lib/errors";

type GroceryItem = {
  name: string;
  quantity: number;
  unit: string;
  checked?: boolean;
};

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

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const [slots, pantryItems] = await Promise.all([
      getMealSlots(user.id, start, end),
      getPantryItems(user.id)
    ]);

    const pantrySet = new Set(pantryItems.map((p) => p.item.toLowerCase().trim()));

    const ingredients = slots.flatMap((slot) => {
      const items = slot.items as { ingredients?: string[] } | null;
      return items?.ingredients || [];
    });

    const missing = ingredients.filter((ing) => !pantrySet.has(ing.toLowerCase().trim()));

    const aggregated = missing.reduce<Record<string, number>>((acc, name) => {
      const key = name.trim();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const list: GroceryItem[] = Object.entries(aggregated).map(([name, quantity]) => ({
      name,
      quantity,
      unit: quantity > 1 ? "units" : "unit"
    }));

    return NextResponse.json({ list, totalSlots: slots.length });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
