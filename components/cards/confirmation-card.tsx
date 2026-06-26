"use client";

import { useState } from "react";
import { CheckCircle2, Clock, IndianRupee, ShieldCheck } from "lucide-react";
import { Recommendation } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export type ConfirmData =
  | { source: "COOK"; addressId: string; itemIds: string[] }
  | { source: "ORDER"; addressId: string; itemIds: string[]; paymentMethod?: string }
  | { source: "DINEOUT"; restaurantId: string; partySize: number; slotISO?: string; slot?: { slotId: number; itemId: string; reservationTime: number } };

export function ConfirmationCard({
  recommendation,
  confirmData
}: {
  recommendation: Recommendation;
  confirmData?: ConfirmData;
}) {
  const [loading, setLoading] = useState(false);
  const subtotal = recommendation.confirmation.lineItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + recommendation.confirmation.fees;

  const handleConfirm = async () => {
    if (!confirmData) return;
    setLoading(true);
    try {
      const res = await fetch("/api/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...confirmData, confirmed: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Confirmation failed");
      toast.success("Confirmed! Your order/booking has been placed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

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

      <Button className="mt-5 w-full" variant="accent" onClick={handleConfirm} disabled={loading || !confirmData}>
        <CheckCircle2 className="h-4 w-4" />
        {loading ? "Confirming..." : "Confirm in Swiggy"}
      </Button>
    </Card>
  );
}
