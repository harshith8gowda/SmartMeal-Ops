"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ChefHat, ShoppingBag, UtensilsCrossed, Loader2 } from "lucide-react";
import type { MealSlot } from "./week-grid";

export type SlotFormData = {
  id?: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  source: "COOK" | "ORDER" | "DINEOUT";
  title: string;
  description: string;
  cost: number;
  timeMinutes: number;
};

const SOURCE_OPTIONS: { value: "cook" | "order" | "dineout"; label: string; icon: typeof ChefHat }[] = [
  { value: "cook", label: "Cook", icon: ChefHat },
  { value: "order", label: "Order", icon: ShoppingBag },
  { value: "dineout", label: "Dineout", icon: UtensilsCrossed }
];

export function SlotSheet({
  slot,
  onClose,
  onSave,
  onDelete
}: {
  slot: MealSlot;
  onClose: () => void;
  onSave: (data: SlotFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [source, setSource] = useState<"cook" | "order" | "dineout">(slot.source || "cook");
  const [title, setTitle] = useState(slot.title || "");
  const [description, setDescription] = useState(slot.description || "");
  const [cost, setCost] = useState(slot.cost || 0);
  const [timeMinutes, setTimeMinutes] = useState(slot.timeMinutes || 30);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const reducedMotion = useReducedMotion();

  async function handleSave() {
    setLoading(true);
    await onSave({
      id: slot.id || undefined,
      date: slot.date,
      mealType: slot.mealType,
      source: source.toUpperCase() as SlotFormData["source"],
      title: title || `${source} option`,
      description,
      cost,
      timeMinutes
    });
    setLoading(false);
  }

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-0">
      <div className="absolute inset-0 bg-foreground opacity-30 backdrop-blur-sm" />
      <motion.div
        className="relative h-full w-full max-w-md overflow-y-auto border-l border-border bg-flour p-6 text-foreground"
        initial={reducedMotion ? false : { x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
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
          {SOURCE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = source === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSource(option.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                  isActive
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-porcelain text-muted-foreground hover:bg-secondary"
                }`}
                aria-pressed={isActive}
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

        {slot.id && onDelete && (
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-3 w-full border-error text-error hover:bg-error/10 hover:text-error"
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete slot
          </Button>
        )}
      </motion.div>
    </div>
  );
}
