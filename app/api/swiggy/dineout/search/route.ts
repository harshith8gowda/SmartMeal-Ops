import { NextRequest, NextResponse } from "next/server";
import { searchRestaurants } from "@/lib/swiggy/dineout";

export async function POST(req: NextRequest) {
  const { query, city } = await req.json();
  const results = await searchRestaurants(query, city);
  return NextResponse.json({ results });
}
