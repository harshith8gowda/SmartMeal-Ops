"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IndianRupee, Clock, Sparkles } from "lucide-react";

export type InputValues = {
  budget: number;
  timeMinutes: number;
  mood: string;
};

export function InputBar({ onChange }: { onChange: (values: InputValues) => void }) {
  const [budget, setBudget] = useState(500);
  const [time, setTime] = useState(30);
  const [mood, setMood] = useState("hungry");

  const moods = ["hungry", "lazy", "healthy", "social", "budget"];
  const times = [
    { label: "15m", value: 15 },
    { label: "30m", value: 30 },
    { label: "1h", value: 60 },
    { label: "No rush", value: 120 }
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-3">
          <IndianRupee className="h-4 w-4 text-primary" />
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-32 accent-primary"
            />
            <span className="min-w-[3.5rem] text-sm font-medium">₹{budget}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent" />
          <div className="flex items-center gap-1">
            {times.map((t) => (
              <Button
                key={t.value}
                variant={time === t.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setTime(t.value)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {moods.map((m) => (
          <Button
            key={m}
            variant={mood === m ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMood(m)}
            className="capitalize"
          >
            {m}
          </Button>
        ))}
        <Button
          size="sm"
          className="ml-auto gap-2"
          onClick={() => onChange({ budget, timeMinutes: time, mood })}
        >
          <Sparkles className="h-4 w-4" />
          Find options
        </Button>
      </div>
    </div>
  );
}
