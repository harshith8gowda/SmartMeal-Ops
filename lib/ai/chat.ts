import OpenAI from "openai";
import { getOpenAIClient } from "./openai";
import { env } from "@/lib/env";

const mockReplies = [
  "Got it. For tonight under ₹700, I'd lean toward a high-protein home cook: paneer tikka with rice and raita. You likely have rice; add paneer, curd, and vegetables to your grocery list.",
  "If you're low energy, ordering a grilled chicken bowl from a Swiggy protein kitchen is faster and still fits a balanced goal.",
  "Dining out makes sense for a Friday unwind. I can add a dineout slot to your meal plan and keep the budget in check.",
  "Tell me your pantry staples and I can narrow this down to what you don't need to buy."
];

export type ChatContext = {
  householdSize: number;
  monthlyBudget: number;
  budgetRemaining: number;
  dietType: string;
  dietaryGoal: string;
  cookingSkill: string;
  cuisines: string[];
  allergies: string[];
  city: string;
  pantry: string[];
};

export async function generateChatReply(history: { role: string; content: string }[], context: ChatContext): Promise<string> {
  if (!env.OPENAI_API_KEY) {
    return mockReplies[Math.floor(Math.random() * mockReplies.length)];
  }

  try {
    const openai = getOpenAIClient();
    const system = `You are MealMap, a helpful food-planning assistant. The user is in ${context.city}, household size ${context.householdSize}, monthly food budget ₹${context.monthlyBudget}, remaining budget ₹${context.budgetRemaining}, diet ${context.dietType}, goal ${context.dietaryGoal}, cooking skill ${context.cookingSkill}, cuisines ${context.cuisines.join(", ")}, allergies ${context.allergies.join(", ")}, pantry ${context.pantry.join(", ")}. Keep replies concise, friendly, and actionable. Suggest Cook, Order, or Dineout when appropriate and explain why. Do not make up prices; use rough estimates only.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...history.slice(-10).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 512
    });

    return completion.choices[0]?.message?.content?.trim() || "I'm not sure how to answer that. Try asking about dinner ideas, budget-friendly meals, or what to cook with what you have.";
  } catch (error) {
    console.warn("OpenAI chat failed, falling back to mock reply:", error);
    return mockReplies[Math.floor(Math.random() * mockReplies.length)];
  }
}
