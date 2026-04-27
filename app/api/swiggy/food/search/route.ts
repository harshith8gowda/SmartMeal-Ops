import { NextRequest, NextResponse } from "next/server";
import { searchFood } from "@/lib/swiggy/food";

export async function POST(req: NextRequest) {
  const { query, city } = await req.json();
  const results = await searchFood(query, city);
  return NextResponse.json({ results });
}
