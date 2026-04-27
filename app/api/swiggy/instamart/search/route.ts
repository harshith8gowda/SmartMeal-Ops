import { NextRequest, NextResponse } from "next/server";
import { searchGroceries } from "@/lib/swiggy/instamart";

export async function POST(req: NextRequest) {
  const { query, city } = await req.json();
  const results = await searchGroceries(query, city);
  return NextResponse.json({ results });
}
