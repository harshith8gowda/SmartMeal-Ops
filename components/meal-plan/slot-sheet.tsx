"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ChefHat, ShoppingBag, UtensilsCrossed, Loader2 } from "lucide-react";
import type { MealSlot } from "./week-grid";

export type SlotFormData = {
  id?: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  source: "cook" | "order" | "dineout";
  title: string;
  description: string;
  cost: number;
  timeMinutes: number;
};

export function SlotSheet({
  slot,
  onClose,
  onSave
}: {
  slot: MealSlot;
  onClose: () => void;
  onSave: (data: SlotFormData) => Promise<void>;
}) {
  const [source, setSource] = useState<SlotFormData["source"]>(slot.source || "cook");
  const [title, setTitle] = useState(slot.title || "");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(slot.cost || 0);
  const [timeMinutes, setTimeMinutes] = useState(slot.timeMinutes || 30);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await onSave({
      id: slot.id || undefined,
      date: slot.date,
      mealType: slot.mealType,
      source,
      title: title || `${source} option`,
      description,
      cost,
      timeMinutes
    });
    setLoading(false);
  }

  const sourceOptions: { value: SlotFormData["source"]; label: string; icon: typeof ChefHat }[] = [
    { value: "cook", label: "Cook", icon: ChefHat },
    { value: "order", label: "Order", icon: ShoppingBag },
    { value: "dineout", label: "Dineout", icon: UtensilsCrossed }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 p-0 backdrop-blur-sm">
      <div className="premium-card h-full w-full max-w-md overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">{slot.mealType}</p>
            <h3 className="font-display text-xl font-semibold">
              {new Date(slot.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric" })}
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {sourceOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSource(option.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                  source === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.07]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Paneer tikka + rice"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes, ingredients, or restaurant"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Cost (₹)</label>
              <Input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Time (min)</label>
              <Input
                type="number"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1 gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save slot
          </Button>
        </div>
      </div>
    </div>
  );
}
