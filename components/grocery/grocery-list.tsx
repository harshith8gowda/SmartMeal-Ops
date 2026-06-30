"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, RotateCcw } from "lucide-react";

export type GroceryItem = {
  name: string;
  quantity: number;
  unit: string;
  checked?: boolean;
};

export function GroceryList({ items, onRegenerate }: { items: GroceryItem[]; onRegenerate?: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    items.forEach((item) => { map[item.name] = item.checked ?? false; });
    return map;
  });

  const pending = items.filter((item) => !checked[item.name]);
  const done = items.filter((item) => checked[item.name]);

  function toggle(name: string) {
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {pending.length} of {items.length} items remaining
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No groceries needed. Your pantry covers the week.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {pending.map((item) => (
            <Card key={item.name} className="flex items-center gap-3 p-4">
              <Checkbox
                id={item.name}
                checked={checked[item.name]}
                onCheckedChange={() => toggle(item.name)}
              />
              <label htmlFor={item.name} className="flex-1 cursor-pointer text-sm font-medium">
                {item.name}
              </label>
              <span className="text-sm text-muted-foreground">
                {item.quantity} {item.unit}
              </span>
            </Card>
          ))}
          {done.length > 0 && (
            <div className="pt-2">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Checked off</p>
              <div className="grid gap-3 opacity-60">
                {done.map((item) => (
                  <Card key={`done-${item.name}`} className="flex items-center gap-3 p-4">
                    <Checkbox
                      id={`done-${item.name}`}
                      checked={checked[item.name]}
                      onCheckedChange={() => toggle(item.name)}
                    />
                    <label htmlFor={`done-${item.name}`} className="flex-1 cursor-pointer text-sm font-medium line-through">
                      {item.name}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
