"use client";

import { Card } from "@/components/ui/card";
import { Target, Wallet, CalendarCheck } from "lucide-react";

export type BudgetStatus = {
  monthlyBudget: number;
  spent: number;
  remaining: number;
  bySource?: Record<string, number>;
};

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function ProgressBar({ value, colorClass }: { value: number; colorClass: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function GoalProgress({
  budget,
  slotsThisWeek,
  maxSlotsPerWeek = 21
}: {
  budget: BudgetStatus;
  slotsThisWeek: number;
  maxSlotsPerWeek?: number;
}) {
  const budgetUsed = budget.monthlyBudget > 0 ? (budget.spent / budget.monthlyBudget) * 100 : 0;
  const slotsFilled = Math.min(100, (slotsThisWeek / maxSlotsPerWeek) * 100);
  const adherence = Math.round((Math.min(100, budgetUsed) + slotsFilled) / 2);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly budget</p>
            <p className="font-display text-2xl font-semibold text-foreground">
              {formatCurrency(budget.spent)} <span className="text-sm font-normal text-muted-foreground">/ {formatCurrency(budget.monthlyBudget)}</span>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={budgetUsed} colorClass="bg-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            {formatCurrency(budget.remaining)} remaining
          </p>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cook-light text-cook">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Week planned</p>
            <p className="font-display text-2xl font-semibold text-foreground">
              {slotsThisWeek} <span className="text-sm font-normal text-muted-foreground">/ {maxSlotsPerWeek} meals</span>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={slotsFilled} colorClass="bg-cook" />
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.round(slotsFilled)}% of this week filled
          </p>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dineout-light text-dineout">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Goal adherence</p>
            <p className="font-display text-2xl font-semibold text-foreground">{adherence}%</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={adherence} colorClass="bg-dineout" />
          <p className="mt-2 text-sm text-muted-foreground">
            Based on budget and meal-plan coverage
          </p>
        </div>
      </Card>
    </div>
  );
}
