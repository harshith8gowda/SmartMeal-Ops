"use client";

import { Card } from "@/components/ui/card";
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

export function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length) return null;

  return (
    <Card className="glass">
      <h3 className="text-lg font-semibold">Recent Orders</h3>
      <ul className="mt-3 space-y-2">
        {orders.map((order) => (
          <li key={order.id} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 text-sm">
            <span className="capitalize">{order.source.toLowerCase()} — {order.provider}</span>
            <span className="font-medium">₹{order.total}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
