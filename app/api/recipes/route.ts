import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, toggleFavoriteRecipe } from "@/lib/db/recipe";
import { mapErrorToResponse } from "@/lib/errors";

const RecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  source: z.enum(["COOK", "ORDER", "DINEOUT"]),
  calories: z.coerce.number().min(0).default(0),
  protein: z.coerce.number().min(0).default(0),
  carbs: z.coerce.number().min(0).default(0),
  fat: z.coerce.number().min(0).default(0),
  ingredients: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  cookTimeMinutes: z.coerce.number().min(0).default(0),
  cost: z.coerce.number().min(0).default(0),
  imageUrl: z.string().optional(),
  isFavorite: z.boolean().optional()
});

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

    const recipes = await getRecipes(user.id);
    return NextResponse.json({ recipes });
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
    const parsed = RecipeSchema.parse(body);
    const recipe = await createRecipe(user.id, parsed);
    return NextResponse.json({ recipe });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(req: NextRequest) {
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
    const { id, ...parsed } = z.object({ id: z.string() }).merge(RecipeSchema.partial()).parse(body);
    const result = await updateRecipe(id, user.id, parsed);
    return NextResponse.json({ ok: true, count: result.count });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(req: NextRequest) {
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
    const { id } = z.object({ id: z.string() }).parse(body);
    const recipe = await toggleFavoriteRecipe(id, user.id);
    return NextResponse.json({ recipe });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(req: NextRequest) {
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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await deleteRecipe(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
