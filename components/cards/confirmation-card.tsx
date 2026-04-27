import { CheckCircle2, Clock, IndianRupee, ShieldCheck } from "lucide-react";
import { Recommendation } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ConfirmationCard({ recommendation }: { recommendation: Recommendation }) {
  const subtotal = recommendation.confirmation.lineItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + recommendation.confirmation.fees;

  return (
    <Card className="dark-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase text-emerald-200">Final confirmation</p>
          <h3 className="mt-1 text-xl font-semibold">{recommendation.confirmation.title}</h3>
          <p className="mt-2 text-sm text-slate-300">No order or reservation is placed until you confirm here.</p>
        </div>
        <ShieldCheck className="h-5 w-5 text-emerald-300" />
      </div>

      <div className="mt-5 space-y-3 text-sm">
        {recommendation.confirmation.lineItems.map((item) => (
          <div key={item.label} className="flex justify-between gap-4 text-slate-200">
            <span>{item.label}</span>
            <span>{item.price === 0 ? "Included" : `₹${item.price}`}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-white/10 pt-3 text-slate-300">
          <span>Fees</span>
          <span>₹{recommendation.confirmation.fees}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4" />Total</span>
          <span>₹{total}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="h-4 w-4" />
          <span>ETA: {recommendation.confirmation.eta}</span>
        </div>
      </div>

      <Button className="mt-5 w-full" variant="accent">
        <CheckCircle2 className="h-4 w-4" />
        Confirm in Swiggy
      </Button>
    </Card>
  );
}
