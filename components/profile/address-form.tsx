"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, MapPin, Trash2 } from "lucide-react";

export type Address = {
  id: string;
  label: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
};

const addressSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(3),
  city: z.string().min(2),
  pincode: z.string().min(4),
  isDefault: z.boolean().default(false)
});

type AddressFormData = z.infer<typeof addressSchema>;

export function AddressForm({ addresses }: { addresses: Address[] }) {
  const [items, setItems] = useState<Address[]>(addresses);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: "", address: "", city: "", pincode: "", isDefault: false }
  });

  async function onSubmit(data: AddressFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to save address");
      const saved = await res.json();
      setItems((prev) => {
        const next = prev.map((a) => (saved.isDefault ? { ...a, isDefault: false } : a));
        const existing = next.find((a) => a.id === saved.id);
        if (existing) {
          return next.map((a) => (a.id === saved.id ? saved : a));
        }
        return [...next, saved];
      });
      reset();
      toast.success("Address saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    const res = await fetch(`/api/address?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete address");
      return;
    }
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  }

  return (
    <Card className="p-5">
      <h2 className="font-display text-lg font-semibold">Saved addresses</h2>
      <p className="text-sm text-muted-foreground">Used for delivery and dineout suggestions.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Label (e.g. Home)" {...register("label")} />
          <Input placeholder="City" {...register("city")} />
        </div>
        <Input placeholder="Full address" {...register("address")} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Pincode" {...register("pincode")} />
          <label className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 text-sm text-muted-foreground">
            <input type="checkbox" {...register("isDefault")} className="accent-primary" />
            Default address
          </label>
        </div>
        <Button type="submit" disabled={loading} className="gap-2 sm:w-fit">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save address
        </Button>
      </form>

      <ul className="mt-6 space-y-3">
        {items.map((a) => (
          <li key={a.id} className="flex items-start justify-between rounded-xl border border-border bg-porcelain p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">
                  {a.label} {a.isDefault && <span className="text-xs text-primary">(default)</span>}
                </p>
                <p className="text-sm text-muted-foreground">{a.address}, {a.city} - {a.pincode}</p>
              </div>
            </div>
            <button onClick={() => onDelete(a.id)} className="text-muted-foreground hover:text-error">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
