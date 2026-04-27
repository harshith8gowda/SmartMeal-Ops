import { Card } from "@/components/ui/card";

export function BudgetOverview() {
  return (
    <Card className="glass">
      <h3 className="text-lg font-semibold">Budget Tracker</h3>
      <p className="mt-2 text-sm text-slate-600">Monthly spend split</p>
      <div className="mt-4 space-y-3 text-sm">
        <div>
          <div className="mb-1 flex justify-between"><span>Groceries</span><span>₹5,200</span></div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 w-2/3 rounded-full bg-indigo-500" /></div>
        </div>
        <div>
          <div className="mb-1 flex justify-between"><span>Ordering</span><span>₹3,400</span></div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 w-1/2 rounded-full bg-violet-500" /></div>
        </div>
        <div>
          <div className="mb-1 flex justify-between"><span>Dineout</span><span>₹1,800</span></div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 w-1/3 rounded-full bg-cyan-500" /></div>
        </div>
      </div>
    </Card>
  );
}
