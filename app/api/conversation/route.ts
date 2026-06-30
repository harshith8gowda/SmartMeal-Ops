import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { getConversation, appendMessage } from "@/lib/db/conversation";
import { mapErrorToResponse } from "@/lib/errors";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1)
});

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

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { role, content } = MessageSchema.parse(body);
    const conversation = await appendMessage(userId, { role, content, createdAt: new Date().toISOString() });
    return NextResponse.json(conversation);
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
