"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { GroceryList, type GroceryItem } from "@/components/grocery/grocery-list";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";

function loadGroceryList() {
  return fetch("/api/grocery")
    .then(async (res) => {
      if (!res.ok) throw new Error("Could not load grocery list");
      const data = await res.json();
      return data.list as GroceryItem[];
    });
}

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGroceryList()
      .then((list) => setItems(list))
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  function refresh() {
    setLoading(true);
    setError(null);
    loadGroceryList()
      .then((list) => setItems(list))
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
        <ScrollReveal>
          <div className="mb-6">
            <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
              <ShoppingCart className="h-4 w-4" /> Groceries
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Grocery list</h1>
            <p className="mt-2 text-muted-foreground">
              Ingredients from your meal plan that are not already in your pantry.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-center">
            <p className="text-error">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <GroceryList items={items || []} onRegenerate={refresh} />
        )}
      </main>
    </>
  );
}
