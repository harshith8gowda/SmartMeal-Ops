"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export type Order = {
  id: string;
  source: "cook" | "order" | "dineout" | string;
  title: string;
  total: number;
  status: string;
  swiggyUrl: string | null;
  createdAt: string;
};

const statusVariant: Record<string, "default" | "secondary" | "accent" | "success" | "warning" | "outline"> = {
  completed: "success",
  ready: "warning",
  pending: "warning",
  cancelled: "outline",
  failed: "outline",
  CONFIRMED: "success",
  PENDING: "warning",
  CANCELLED: "outline",
  FAILED: "outline"
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No carts or bookings yet. Head to the dashboard to build your first one.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-5">
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
  );
}
