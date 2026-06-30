"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { OrderList, type Order } from "@/components/orders/order-list";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

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
        ) : (
          <OrderList orders={orders} />
        )}
      </main>
    </>
  );
}
