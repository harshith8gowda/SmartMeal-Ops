import { Card } from "@/components/ui/card";

const spend = [
  { label: "Groceries", value: 5200, width: "68%", color: "bg-primary" },
  { label: "Ordering", value: 3400, width: "44%", color: "bg-accent" },
  { label: "Dineout", value: 1800, width: "24%", color: "bg-slate-700" }
];

export function BudgetOverview() {
  return (
    <Card className="glass">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Budget Tracker</h3>
          <p className="mt-1 text-sm text-muted-foreground">Monthly spend split</p>
        </div>
        <p className="rounded-md bg-muted px-2 py-1 text-xs font-medium">₹10.4k / ₹12k</p>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        {spend.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between"><span>{item.label}</span><span>₹{item.value.toLocaleString("en-IN")}</span></div>
            <div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${item.color}`} style={{ width: item.width }} /></div>
          </div>
        ))}
      </div>
    </Card>
  );
}
