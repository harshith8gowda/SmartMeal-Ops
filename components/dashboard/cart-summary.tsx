"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, X, ShoppingBag } from "lucide-react";
import type { ComparisonRecommendation } from "./comparison-card-v2";

export function CartSummary({
  recommendation,
  onClose
}: {
  recommendation: ComparisonRecommendation;
  onClose: () => void;
}) {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buildCart() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recommendation })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not build cart");
      setRedirectUrl(data.redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground opacity-30 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-flour p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <h3 className="font-display text-xl font-semibold">{recommendation.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p>

        <ul className="mt-5 space-y-2">
          {recommendation.items.map((item, i) => (
            <li key={`${item.name}-${i}`} className="flex items-center justify-between text-sm">
              <span>{item.name}</span>
              <span className="text-muted-foreground">{item.price ? `₹${item.price}` : item.quantity || ""}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">Total estimated</span>
          <span className="font-semibold">₹{recommendation.cost}</span>
        </div>

        {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={buildCart} disabled={loading} className="flex-1 gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Building..." : "Build in Swiggy"}
          </Button>
        </div>

        {redirectUrl && (
          <a
            href={redirectUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-center text-sm font-medium text-primary hover:underline"
          >
            Open in Swiggy <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
