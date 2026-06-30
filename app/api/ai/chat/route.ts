import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/auth/clerk";
import { getPreference } from "@/lib/db/preference";
import { getPantryItems } from "@/lib/db/pantry";
import { getAddresses } from "@/lib/db/address";
import { getConversation, appendMessage } from "@/lib/db/conversation";
import { generateChatReply } from "@/lib/ai/chat";
import { mapErrorToResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const ChatInputSchema = z.object({
  message: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await rateLimit(`chat:${userId}`, 20, 60);

    const user = await ensureDbUser(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message } = ChatInputSchema.parse(body);

    const [preference, pantryItems, addresses, conversation] = await Promise.all([
      getPreference(user.id),
      getPantryItems(user.id),
      getAddresses(user.id),
      getConversation(user.id)
    ]);

    const address = addresses.find((a) => a.isDefault) || addresses[0];

    const context = {
      householdSize: preference?.householdSize ?? 2,
      monthlyBudget: preference?.monthlyBudget ?? 500,
      budgetRemaining: preference?.monthlyBudget ?? 500,
      dietType: preference?.diet?.[0] ?? "non-veg",
      dietaryGoal: (preference?.dietaryGoal ?? "BALANCED").toLowerCase(),
      cookingSkill: preference?.cookingSkill ?? "medium",
      cuisines: preference?.cuisines ?? [],
      allergies: preference?.allergies ?? [],
      city: address?.city ?? "Bengaluru",
      pantry: pantryItems.map((p) => p.item)
    };

    const history = (conversation?.messages as { role: string; content: string }[]) ?? [];
    const reply = await generateChatReply([...history, { role: "user", content: message }], context);

    await Promise.all([
      appendMessage(user.id, { role: "user", content: message, createdAt: new Date().toISOString() }),
      appendMessage(user.id, { role: "assistant", content: reply, createdAt: new Date().toISOString() })
    ]);

    return NextResponse.json({ reply });
  } catch (error) {
    const { status, body } = mapErrorToResponse(error);
    return NextResponse.json(body, { status });
  }
}
