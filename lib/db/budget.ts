import { getMonthlySpend } from "./orders";

export async function getBudgetStatus(userId: string, monthlyBudget: number) {
  const spend = await getMonthlySpend(userId);
  const remaining = Math.max(0, monthlyBudget - spend.total);

  return {
    monthlyBudget,
    spent: spend.total,
    remaining,
    bySource: spend.bySource
  };
}
