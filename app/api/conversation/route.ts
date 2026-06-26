import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/clerk";
import { getConversation } from "@/lib/db/conversation";
import { mapErrorToResponse } from "@/lib/errors";

export async function GET() {
  try {
    const userId = await requireUserId();
    const conversation = await getConversation(userId);
    return NextResponse.json(conversation ?? { messages: [] });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
