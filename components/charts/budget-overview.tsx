import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    { label: "Dineout", key: "DINEOUT", color: "bg-warning" }
  ];

  const maxValue = Math.max(monthlyBudget, spent, 1);
  const remaining = Math.max(0, monthlyBudget - spent);
  const percent = Math.min(100, Math.round((spent / monthlyBudget) * 100));

  return (
    <Card className="gradient-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Budget Tracker</CardTitle>
            <CardDescription>Monthly spend split</CardDescription>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium">
            ₹{spent.toLocaleString("en-IN")} / ₹{monthlyBudget.toLocaleString("en-IN")}
          </span>
        </div>
      </CardHeader>
      <div className="px-5 pb-5">
        <div className="mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium text-success">₹{remaining.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-white/10">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {labels.map((item) => {
            const value = bySource[item.key] ?? 0;
            const width = `${Math.min(100, (value / maxValue) * 100)}%`;
            return (
              <div key={item.label}>
                <div className="mb-1 flex justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">₹{value.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
