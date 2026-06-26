import { getPrisma } from "./prisma";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export async function getConversation(userId: string) {
  const prisma = getPrisma();
  return prisma.conversation.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function appendMessage(userId: string, message: ChatMessage) {
  const prisma = getPrisma();
  const existing = await getConversation(userId);

  const messages = existing ? [...(existing.messages as ChatMessage[]), message] : [message];

  if (existing) {
    return prisma.conversation.update({
      where: { id: existing.id },
      data: { messages, updatedAt: new Date() }
    });
  }

  return prisma.conversation.create({
    data: {
      userId,
      messages
    }
  });
}

export async function resetConversation(userId: string) {
  const prisma = getPrisma();
  return prisma.conversation.deleteMany({
    where: { userId }
  });
}
