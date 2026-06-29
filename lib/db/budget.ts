import { getMonthlySpend } from "./orders";
import { getPreference } from "./preference";

export async function getBudgetStatus(userId: string, monthlyBudget?: number) {
  const spend = await getMonthlySpend(userId);
  const preference = monthlyBudget === undefined ? await getPreference(userId) : null;
  const budget = monthlyBudget ?? preference?.monthlyBudget ?? 500;
  const remaining = Math.max(0, budget - spend.total);

  return {
    monthlyBudget: budget,
    spent: spend.total,
    remaining,
    bySource: spend.bySource
  };
}
