import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from "@/lib/env";
import { MealPlanSchema } from "./schemas";
import { buildPlannerPrompt } from "./prompts";

export function getOpenAIClient() {
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export async function callOpenAIPlanner({
  prompt,
  userContext
}: {
  prompt: string;
  userContext: {
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
}) {
  const openai = getOpenAIClient();

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildPlannerPrompt(userContext) },
      { role: "user", content: prompt }
    ],
    response_format: zodResponseFormat(MealPlanSchema, "meal_plan"),
    temperature: 0.4,
    max_tokens: 2048
  });

  const parsed = completion.choices[0]?.message?.parsed;
  if (!parsed) {
    throw new Error("OpenAI returned empty parsed response");
  }

  return parsed.days;
}
