import { Card } from "@/components/ui/card";

export function BudgetOverview({
  monthlyBudget,
  spent,
  bySource
}: {
  monthlyBudget: number;
  spent: number;
  bySource: Record<string, number>;
}) {
  const labels = [
    { label: "Groceries", key: "COOK", color: "bg-primary" },
    { label: "Ordering", key: "ORDER", color: "bg-accent" },
    { label: "Dineout", key: "DINEOUT", color: "bg-slate-700" }
  ];

  const maxValue = Math.max(monthlyBudget, spent, 1);

  return (
    <Card className="glass">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Budget Tracker</h3>
          <p className="mt-1 text-sm text-muted-foreground">Monthly spend split</p>
        </div>
        <p className="rounded-md bg-muted px-2 py-1 text-xs font-medium">₹{spent.toLocaleString("en-IN")} / ₹{monthlyBudget.toLocaleString("en-IN")}</p>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        {labels.map((item) => {
          const value = bySource[item.key] ?? 0;
          const width = `${Math.min(100, (value / maxValue) * 100)}%`;
          return (
            <div key={item.label}>
              <div className="mb-1 flex justify-between"><span>{item.label}</span><span>₹{value.toLocaleString("en-IN")}</span></div>
              <div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${item.color}`} style={{ width }} /></div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
