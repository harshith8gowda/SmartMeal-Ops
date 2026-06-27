"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MealSource } from "@prisma/client";

export type Order = {
  id: string;
  provider: string;
  source: MealSource;
  status: string;
  total: number;
  etaMinutes: number | null;
  createdAt: Date;
};

const statusVariant: Record<string, "default" | "secondary" | "accent" | "success" | "warning" | "outline"> = {
  CONFIRMED: "success",
  PENDING: "warning",
  CANCELLED: "outline",
  FAILED: "outline"
};

export function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>No orders yet — your first smart move is one click away.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your last {orders.length} actions</CardDescription>
      </CardHeader>
      <ul className="space-y-2 px-5 pb-5">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm transition-colors hover:bg-white/[0.07]"
          >
            <div className="flex items-center gap-3">
              <span className="capitalize text-foreground">{order.source.toLowerCase()}</span>
              <span className="text-xs text-muted-foreground">{order.provider}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium">₹{order.total}</span>
              <Badge variant={statusVariant[order.status] ?? "secondary"} className="text-[10px]">
                {order.status.toLowerCase()}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
