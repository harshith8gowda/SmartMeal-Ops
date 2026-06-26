"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type PantryItem = {
  id: string;
  item: string;
  qty: number;
  unit: string;
  recurring: boolean;
};

const PantryItemSchema = z.object({
  item: z.string().min(2),
  qty: z.coerce.number().min(0),
  unit: z.string().min(1),
  recurring: z.boolean().default(false)
});

type PantryFormData = z.infer<typeof PantryItemSchema>;

export function PantryManager({ pantryItems }: { pantryItems: PantryItem[] }) {
  const [items, setItems] = useState<PantryItem[]>(pantryItems);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PantryFormData>({
    resolver: zodResolver(PantryItemSchema),
    defaultValues: { item: "", qty: 1, unit: "pcs", recurring: false }
  });

  const onSubmit = async (data: PantryFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to add pantry item");
      const item = await res.json();
      setItems((prev) => {
        const existing = prev.find((p) => p.item.toLowerCase() === item.item.toLowerCase());
        if (existing) {
          return prev.map((p) => (p.id === item.id ? item : p));
        }
        return [...prev, item];
      });
      reset();
      toast.success("Pantry item added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add pantry item");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/pantry?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete pantry item");
      setItems((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pantry item removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete pantry item");
    }
  };

  return (
    <Card className="glass">
      <h2 className="text-xl font-semibold">Your Pantry</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-2 sm:grid-cols-5">
        <Input placeholder="Item" {...register("item")} />
        <Input type="number" step="0.1" placeholder="Qty" {...register("qty")} />
        <Input placeholder="Unit" {...register("unit")} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("recurring")} />
          Recurring
        </label>
        <Button type="submit" disabled={isLoading}>Add</Button>
      </form>
      {errors.item && <p className="mt-2 text-sm text-red-500">{errors.item.message}</p>}

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
            <span>{item.item} — {item.qty} {item.unit}</span>
            <button
              onClick={() => onDelete(item.id)}
              className="text-muted-foreground hover:text-red-500"
              aria-label={`Delete ${item.item}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
