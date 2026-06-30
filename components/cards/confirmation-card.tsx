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
    <Card className="overflow-hidden border-border bg-flour">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
            <ShieldCheck className="h-3.5 w-3.5" /> Final confirmation
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold">{recommendation.confirmation.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">No order or reservation is placed until you confirm here.</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cook-light text-success">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        {recommendation.confirmation.lineItems.map((item) => (
          <div key={item.label} className="flex justify-between gap-4 text-foreground">
            <span>{item.label}</span>
            <span>{item.price === 0 ? "Included" : `₹${item.price}`}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-3 text-muted-foreground">
          <span>Fees</span>
          <span>₹{recommendation.confirmation.fees}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4" />Total</span>
          <span>₹{total}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
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
