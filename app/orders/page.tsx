"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ShoppingBag } from "lucide-react";

type OrderHistory = {
  id: string;
  source: "cook" | "order" | "dineout";
  title: string;
  total: number;
  status: string;
  swiggyUrl: string | null;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const statusVariant: Record<string, "default" | "secondary" | "accent" | "success" | "warning" | "outline"> = {
  completed: "success",
  ready: "warning",
  pending: "warning",
  cancelled: "outline",
  failed: "outline"
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderHistory[] | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6">
          <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
            <ShoppingBag className="h-4 w-4" /> History
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Orders & bookings</h1>
          <p className="mt-2 text-muted-foreground">
            Carts and bookings you built in Swiggy. MealMap never places real orders.
          </p>
        </div>

        {orders === null ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="gradient-border p-8 text-center">
            <p className="text-muted-foreground">No carts or bookings yet. Head to the dashboard to build your first one.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="gradient-border p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold">{order.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.source} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">₹{order.total}</span>
                    <Badge variant={statusVariant[order.status] ?? "secondary"}>{order.status}</Badge>
                  </div>
                </div>
                {order.swiggyUrl && (
                  <a
                    href={order.swiggyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    View in Swiggy <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
