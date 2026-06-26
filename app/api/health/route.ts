import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "error", db: "disconnected" }, { status: 500 });
  }
}
