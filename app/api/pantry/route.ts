import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { getPantryItems, createPantryItem, updatePantryItem, deletePantryItem } from "@/lib/db/pantry";
import { mapErrorToResponse } from "@/lib/errors";

const PantryItemSchema = z.object({
  item: z.string().min(2),
  qty: z.coerce.number().min(0),
  unit: z.string().min(1),
  recurring: z.boolean().default(false)
});

export async function GET() {
  try {
    const userId = await requireUserId();
    const items = await getPantryItems(userId);
    return NextResponse.json(items);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const parsed = PantryItemSchema.parse(body);
    const item = await createPantryItem(userId, parsed.item, parsed.qty, parsed.unit, parsed.recurring);
    return NextResponse.json(item);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const parsed = PantryItemSchema.partial().parse(body);
    await updatePantryItem(id, userId, parsed);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await deletePantryItem(id, userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
